from flask import Flask
from routes.users import users_bp
from routes.times import times_bp

app = Flask(__name__)

# Blueprints --------------------------------
app.register_blueprint(users_bp)
app.register_blueprint(times_bp)

# routes -------------------------------------
@app.route("/")
def home():
    return "Welcome to the Cube Timer App!"


if __name__ == "__main__":
    app.run()