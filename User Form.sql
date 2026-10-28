USE MediMate_db;

CREATE TABLE MediMate_User_Profile (
    user_id INT PRIMARY KEY,

    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),

    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(20),

    mobile_number VARCHAR(15),
    address TEXT,
    user_photo LONGTEXT,

    bp VARCHAR(10),
    diabetes VARCHAR(10),
    heart_disease VARCHAR(10),

    medicine_allergies TEXT,
    other_medical_conditions TEXT,

    family_doctor_name VARCHAR(150),
    family_doctor_contact VARCHAR(15),
    emergency_contact_number VARCHAR(15),

    FOREIGN KEY (user_id)
        REFERENCES MediMate_Register(id)
        ON DELETE CASCADE
);