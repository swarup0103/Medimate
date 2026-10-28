from flask import Blueprint, request, jsonify, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

routes = Blueprint("routes", __name__)


# ---------------- DATABASE CONNECTION ----------------

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Swarup@1365",
        database="MediMate_db",
        port=3306
    )


# ---------------- REGISTRATION ROUTE ----------------

@routes.route("/register", methods=["POST", "OPTIONS"])
def register():

    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}

    full_name = data.get("full_name")
    dob = data.get("DOB")
    phone = data.get("phone")
    email = data.get("email")
    password = data.get("password")

    if not all([full_name, dob, phone, email, password]):
        return jsonify({
            "message": "All fields are required"
        }), 400

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check whether email already exists
        cursor.execute(
            "SELECT email FROM MediMate_Register WHERE email = %s",
            (email,)
        )

        if cursor.fetchone():
            return jsonify({
                "message": "Email already registered"
            }), 409

        # Encrypt the password before storing it
        hashed_password = generate_password_hash(password)

        sql = """
            INSERT INTO MediMate_Register
            (full_name, DOB, phone, email, Pass)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(
            sql,
            (full_name, dob, phone, email, hashed_password)
        )

        conn.commit()

        return jsonify({
            "message": "Registration successful!"
        }), 201

    except mysql.connector.Error as error:
        if conn and conn.is_connected():
            conn.rollback()

        print("Registration database error:", error)

        return jsonify({
            "message": "Database error occurred"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn and conn.is_connected():
            conn.close()


# ---------------- LOGIN ROUTE ----------------

@routes.route("/login", methods=["POST", "OPTIONS"])
def login():

    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, full_name, email, Pass
            FROM MediMate_Register
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user or not check_password_hash(user["Pass"], password):
            return jsonify({
                "message": "Invalid email or password"
            }), 401
        session["user_id"] = user["id"]

        return jsonify({
            "message": "Login successful!",
            "user": {
                "full_name": user["full_name"],
                "email": user["email"]
            }
        }), 200

    except mysql.connector.Error as error:
        print("Login database error:", error)

        return jsonify({
            "message": "Database error occurred"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn and conn.is_connected():
            conn.close()