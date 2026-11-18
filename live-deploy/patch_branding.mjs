import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.argv[2];
if (!root) throw new Error("Pass the extracted frontend project directory.");

async function edit(relativePath, transform) {
  const file = path.join(root, relativePath);
  const before = (await readFile(file, "utf8")).replaceAll("\r\n", "\n");
  const after = transform(before);
  if (after === before) throw new Error(`Branding patch did not apply to ${relativePath}`);
  await writeFile(file, after, "utf8");
}

await edit("index.html", (text) => text
  .replace('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
           '<link rel="icon" type="image/png" href="/Logo.png" />')
  .replace("<title>medimate</title>", "<title>MediMate | Medicine Management</title>"));

await edit("src/components/Sidebar.jsx", (text) => text
  .replace("  FiHeart,\n", "")
  .replace('<div className="brand-icon"><FiHeart aria-hidden="true" /></div>',
           '<div className="brand-icon"><img src="/Logo.png" alt="MediMate logo" /></div>'));

await edit("src/components/Sidebar.css", (text) => text.replace(
  /\.brand-icon\s*\{[^}]*\}\s*\.brand-icon svg\s*\{[^}]*\}/s,
  `.brand-icon {
  display: grid;
  place-items: center;
  flex: 0 0 48px;
  width: 48px;
  height: 40px;
  overflow: hidden;
  border-radius: 9px;
  background: #082b55;
}

.brand-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}`
));

const emailUtilsFile = path.resolve(root, "../backend/email_utils.py");
await writeFile(emailUtilsFile, `import json
import os
import smtplib
import urllib.error
import urllib.request
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")


def send_email(to_email, subject, body):
    # Use HTTPS on Railway when RESEND_API_KEY is configured.
    resend_api_key = os.getenv("RESEND_API_KEY")
    if resend_api_key:
        from_email = os.getenv("RESEND_FROM") or os.getenv("MAIL_FROM")
        from_name = os.getenv("MAIL_FROM_NAME", "MediMate")
        if not from_email:
            raise RuntimeError("RESEND_FROM (or MAIL_FROM) must be set when using Resend.")

        payload = json.dumps({
            "from": formataddr((from_name, from_email)),
            "to": [to_email],
            "subject": subject,
            "text": body,
        }).encode("utf-8")
        request = urllib.request.Request(
            "https://api.resend.com/emails",
            data=payload,
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                if not 200 <= response.status < 300:
                    raise RuntimeError(f"Email provider returned HTTP {response.status}.")
        except urllib.error.HTTPError as exc:
            raise RuntimeError(f"Email provider rejected the request (HTTP {exc.code}).") from None
        except urllib.error.URLError as exc:
            raise RuntimeError("Could not reach the email provider over HTTPS.") from exc
        return

    smtp_host = os.getenv("MAIL_HOST")
    smtp_port = int(os.getenv("MAIL_PORT", "587"))
    mail_username = os.getenv("MAIL_USERNAME")
    mail_password = os.getenv("MAIL_PASSWORD")
    from_email = os.getenv("MAIL_FROM", mail_username)
    from_name = os.getenv("MAIL_FROM_NAME", "MediMate")

    if not all([smtp_host, mail_username, mail_password, from_email]):
        raise RuntimeError("Email settings .env madhye incomplete aahet.")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr((from_name, from_email))
    message["To"] = to_email
    message.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        server.starttls()
        server.login(mail_username, mail_password)
        server.send_message(message)
`, "utf8");

await edit("src/pages/Login.jsx", (text) => text
  .replace(`      setOtpStep(true);
      setMessage(result.message || "Email var OTP pathavla aahe.");`,
           `      localStorage.setItem("userName", result.user?.full_name || "User");
      onNavigate?.("dashboard");`)
  .replace('{loading ? "Sending OTP..." : "Login"}',
           '{loading ? "Signing in..." : "Login"}')
);

const authRoutesFile = path.resolve(root, "../backend/routes/auth_routes.py");
let authRoutes = (await readFile(authRoutesFile, "utf8")).replaceAll("\\r\\n", "\\n");
const otpStart = '        otp = f"{secrets.randbelow(1_000_000):06d}"';
const otpEndLine = '        return jsonify({"otp_required": True, "message": "A login code was sent to your email."}), 200';
const startIndex = authRoutes.indexOf(otpStart);
const endIndex = authRoutes.indexOf(otpEndLine, startIndex);
if (startIndex < 0 || endIndex < 0) throw new Error("Login OTP block was not found.");
const endIndexWithNewline = authRoutes.indexOf("\\n", endIndex) + 1;
const passwordOnlyLogin = `        session.clear()
        session["user_id"] = user[0]
        session.permanent = True
        return jsonify({"message": "Login successful.", "user": {"id": user[0], "full_name": user[1], "email": user[2], "role": user[4], "approval_status": user[5]}}), 200
`;
authRoutes = authRoutes.slice(0, startIndex) + passwordOnlyLogin + authRoutes.slice(endIndexWithNewline);
authRoutes = authRoutes
  .replace('current_app.logger.exception("Login OTP could not be sent")',
           'current_app.logger.exception("Login failed")')
  .replace('return jsonify({"message": "Could not send the login code. Please check email settings and try again."}), 500',
           'return jsonify({"message": "Login failed. Please try again."}), 500');
await writeFile(authRoutesFile, authRoutes, "utf8");
