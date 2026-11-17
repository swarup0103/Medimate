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
