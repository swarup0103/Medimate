from flask import Blueprint, request, jsonify, session, current_app
from routes import get_db_connection

profile_bp = Blueprint("profile", __name__)


# ==========================================
# GET: FETCH LOGGED-IN USER PROFILE
# ==========================================
@profile_bp.route("/api/profile", methods=["GET"])
def get_profile():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "message": "Please login first"
        }), 401

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM MediMate_User_Profile
            WHERE user_id = %s
            """,
            (user_id,)
        )

        profile = cursor.fetchone()

        if profile:
            return jsonify({
                "profile": profile
            }), 200

        return jsonify({
            "message": "Profile not found"
        }), 404

    except Exception:
        current_app.logger.exception("Error fetching profile")

        return jsonify({
            "message": "Unable to fetch profile"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn and conn.is_connected():
            conn.close()


# ==========================================
# POST: SAVE OR UPDATE USER PROFILE
# ==========================================
@profile_bp.route("/api/profile", methods=["POST"])
def save_profile():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "message": "Please login first"
        }), 401

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "message": "Invalid request data"
        }), 400

    age = data.get("age")

    try:
        age = int(age) if age not in (None, "") else None
    except (ValueError, TypeError):
        return jsonify({
            "message": "Age must be a valid number"
        }), 400

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO MediMate_User_Profile (
                user_id,
                first_name,
                middle_name,
                last_name,
                age,
                gender,
                blood_group,
                mobile_number,
                address,
                bp,
                diabetes,
                heart_disease,
                medicine_allergies,
                other_medical_conditions,
                family_doctor_name,
                family_doctor_contact,
                emergency_contact_number,
                user_photo
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            ON DUPLICATE KEY UPDATE
                first_name = VALUES(first_name),
                middle_name = VALUES(middle_name),
                last_name = VALUES(last_name),
                age = VALUES(age),
                gender = VALUES(gender),
                blood_group = VALUES(blood_group),
                mobile_number = VALUES(mobile_number),
                address = VALUES(address),
                bp = VALUES(bp),
                diabetes = VALUES(diabetes),
                heart_disease = VALUES(heart_disease),
                medicine_allergies = VALUES(medicine_allergies),
                other_medical_conditions =
                    VALUES(other_medical_conditions),
                family_doctor_name = VALUES(family_doctor_name),
                family_doctor_contact = VALUES(family_doctor_contact),
                emergency_contact_number =
                    VALUES(emergency_contact_number),
                user_photo = VALUES(user_photo)
            """,
            (
                user_id,
                data.get("first_name"),
                data.get("middle_name"),
                data.get("last_name"),
                age,
                data.get("gender"),
                data.get("blood_group"),
                data.get("mobile_number"),
                data.get("address"),
                data.get("bp"),
                data.get("diabetes"),
                data.get("heart_disease"),
                data.get("medicine_allergies"),
                data.get("other_medical_conditions"),
                data.get("family_doctor_name"),
                data.get("family_doctor_contact"),
                data.get("emergency_contact_number"),
                data.get("user_photo")
            )
        )

        conn.commit()

        return jsonify({
            "message": "Profile saved successfully"
        }), 200

    except Exception:
        if conn and conn.is_connected():
            conn.rollback()

        current_app.logger.exception("Error saving profile")

        return jsonify({
            "message": "Unable to save profile"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conn and conn.is_connected():
            conn.close()

