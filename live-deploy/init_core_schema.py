"""Create the core MediMate tables on a fresh hosted database before app startup."""
import logging
import os

from werkzeug.security import generate_password_hash

from db import get_db_connection

logger = logging.getLogger(__name__)

CORE_SCHEMA = (
    """
    CREATE TABLE IF NOT EXISTS medimate_register (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        DOB DATE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        `Pass` VARCHAR(255) NOT NULL,
        role ENUM('patient','admin') NOT NULL DEFAULT 'patient',
        approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        is_primary_admin TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """,
    """
    CREATE TABLE IF NOT EXISTS medimate_login_otps (
        user_id INT NOT NULL PRIMARY KEY,
        otp_hash CHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        CONSTRAINT fk_medimate_login_otp_user
            FOREIGN KEY (user_id) REFERENCES medimate_register(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """,
    """
    CREATE TABLE IF NOT EXISTS medimate_medicines (
        medicine_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        medicine_name VARCHAR(200) NOT NULL,
        medicine_image LONGTEXT NULL,
        medicine_type VARCHAR(100) NOT NULL,
        dosage_mg DECIMAL(10,2) NOT NULL,
        tablets_per_dose INT NOT NULL,
        total_tablets INT NOT NULL,
        frequency VARCHAR(30) NOT NULL,
        medicine_time TIME NOT NULL,
        dose_times LONGTEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NULL,
        food_instruction VARCHAR(100) NULL,
        caretaker_name VARCHAR(150) NULL,
        caretaker_mobile VARCHAR(15) NULL,
        caretaker_email VARCHAR(254) NULL,
        notes TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY idx_medimate_medicine_user (user_id),
        CONSTRAINT fk_medimate_medicine_user
            FOREIGN KEY (user_id) REFERENCES medimate_register(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """,
    """
    CREATE TABLE IF NOT EXISTS medimate_dose_logs (
        dose_log_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        medicine_id INT NOT NULL,
        scheduled_date DATE NOT NULL,
        scheduled_time TIME NOT NULL,
        status ENUM('pending','taken','not_taken') NOT NULL DEFAULT 'pending',
        taken_at DATETIME NULL,
        push_sent_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_medimate_dose (medicine_id, scheduled_date, scheduled_time),
        KEY idx_medimate_dose_user_date (user_id, scheduled_date),
        CONSTRAINT fk_medimate_dose_user
            FOREIGN KEY (user_id) REFERENCES medimate_register(id) ON DELETE CASCADE,
        CONSTRAINT fk_medimate_dose_medicine
            FOREIGN KEY (medicine_id) REFERENCES medimate_medicines(medicine_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """,
)


def ensure_primary_admin(cursor):
    email = os.getenv("DEFAULT_ADMIN_EMAIL", "").strip().lower()
    password = os.getenv("DEFAULT_ADMIN_PASSWORD", "")
    if not email and not password:
        return
    if not email or not password:
        raise RuntimeError("Set both DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD.")
    if len(email) > 254 or email.count("@") != 1 or "." not in email.rsplit("@", 1)[-1]:
        raise RuntimeError("DEFAULT_ADMIN_EMAIL must be a valid email address.")

    cursor.execute(
        "SELECT id, role, approval_status, is_primary_admin FROM medimate_register WHERE email = %s",
        (email,),
    )
    user = cursor.fetchone()
    if user:
        if user[1] != "admin" or user[2] != "approved" or not user[3]:
            cursor.execute(
                "UPDATE medimate_register SET role = 'admin', approval_status = 'approved', "
                "is_primary_admin = 1, Pass = %s WHERE id = %s",
                (generate_password_hash(password), user[0]),
            )
        return

    full_name = os.getenv("DEFAULT_ADMIN_FULL_NAME", "").strip()
    dob = os.getenv("DEFAULT_ADMIN_DOB", "").strip()
    phone = os.getenv("DEFAULT_ADMIN_PHONE", "").strip()
    if not all((full_name, dob, phone)):
        logger.warning(
            "No account exists for DEFAULT_ADMIN_EMAIL. Set DEFAULT_ADMIN_FULL_NAME, "
            "DEFAULT_ADMIN_DOB, and DEFAULT_ADMIN_PHONE to create the primary admin."
        )
        return
    if len(full_name) > 100 or not full_name.replace(" ", "").isalpha():
        raise RuntimeError("DEFAULT_ADMIN_FULL_NAME must contain 2-100 letters and spaces.")
    if not phone.isdigit() or not 10 <= len(phone) <= 15:
        raise RuntimeError("DEFAULT_ADMIN_PHONE must contain 10-15 digits.")

    cursor.execute(
        """
        INSERT INTO medimate_register
            (full_name, DOB, phone, email, Pass, role, approval_status, is_primary_admin)
        VALUES (%s, %s, %s, %s, %s, 'admin', 'approved', 1)
        """,
        (full_name, dob, phone, email, generate_password_hash(password)),
    )


def main():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        for statement in CORE_SCHEMA:
            cursor.execute(statement)
        cursor.execute("SHOW COLUMNS FROM medimate_register LIKE %s", ("role",))
        if not cursor.fetchone():
            cursor.execute(
                "ALTER TABLE medimate_register ADD COLUMN role "
                "ENUM('patient','admin') NOT NULL DEFAULT 'patient'"
            )
        cursor.execute("SHOW COLUMNS FROM medimate_register LIKE %s", ("approval_status",))
        if not cursor.fetchone():
            cursor.execute(
                "ALTER TABLE medimate_register ADD COLUMN approval_status "
                "ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'"
            )
        cursor.execute("SHOW COLUMNS FROM medimate_register LIKE %s", ("is_primary_admin",))
        if not cursor.fetchone():
            cursor.execute(
                "ALTER TABLE medimate_register ADD COLUMN is_primary_admin "
                "TINYINT(1) NOT NULL DEFAULT 0"
            )
        ensure_primary_admin(cursor)
        connection.commit()
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    main()
