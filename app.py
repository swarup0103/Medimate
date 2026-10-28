from flask import Flask
from flask_cors import CORS
from routes import routes
from profile_routes import profile_bp

app = Flask(__name__)

# Session configuration
app.config["SECRET_KEY"] = "MediMate_Change_This_Secret_Key"

# Allow frontend requests and session cookies
CORS(app, supports_credentials=True)

# Register existing routes
app.register_blueprint(routes)

# Register profile routes
app.register_blueprint(profile_bp)


@app.route("/")
def home():
    return "MediMate Server is Running Successfully!"


if __name__ == "__main__":
    app.run(debug=True, port=5000)