"""Create the core MediMate tables on a fresh hosted database before app startup."""
from db import get_db_connection

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

def main():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        for statement in CORE_SCHEMA:
            cursor.execute(statement)
        connection.commit()
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    main()
