from flask import Flask
from flask_cors import CORS
from routes.users import users_bp
from routes.times import times_bp


app = Flask(__name__)
CORS(app)

# Blueprints --------------------------------
app.register_blueprint(users_bp)
app.register_blueprint(times_bp)

# routes -------------------------------------
@app.route("/")
def home():
    return "Welcome to the Cube Timer App!"


if __name__ == "__main__":
    app.run()