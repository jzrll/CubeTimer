from flask import Blueprint, request, jsonify
from services.db import get_db_connection

users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/", methods=["POST"])
def create_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    
    if not username or not password or not confirm_password:
        return jsonify({"error": "Missing required fields"}), 400
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id",
            (username, password)
        )
        row = cur.fetchone()
        if row:
            user_id = row[0]
        else:
            user_id = None
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({"id": user_id, "username": username}), 201


@users_bp.route("/login", methods=["POST"])
def login_user_post():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "SELECT id, username FROM users WHERE username=%s AND password=%s",
            (username, password)
        )
        row = cur.fetchone()
        if row:
            user_id = row[0]
            username = row[1]
        else:
            user_id = None
            username = None
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

    if user_id:
        return jsonify({"id": user_id, "username": username}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
