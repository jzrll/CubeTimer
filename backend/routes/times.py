from flask import Blueprint, request, jsonify
from services.db import get_db_connection

times_bp = Blueprint("times", __name__, url_prefix="/times")


# Get all times for all users
@times_bp.route("/", methods=["GET"])
def get_all_times():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, user_id, time, created_at
        FROM times
        ORDER BY created_at DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # convert rows to list of dicts
    result = [
        {"id": r[0], "user_id": r[1], "time": float(r[2]), "created_at": r[3].isoformat()}
        for r in rows
    ]
    return jsonify(result), 200


# Get all times for a single user
@times_bp.route("/user/<int:user_id>", methods=["GET"])
def get_times_for_user(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, time, created_at
        FROM times
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    result = [
        {"id": r[0], "time": float(r[1]), "created_at": r[2].isoformat()}
        for r in rows
    ]
    return jsonify(result), 200


# Add a new time
@times_bp.route("/", methods=["POST"])
def add_time():
    data = request.get_json()
    user_id = data.get("user_id")
    time_value = data.get("time")

    if not user_id or time_value is None:
        return jsonify({"error": "user_id and time are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO times (user_id, time) VALUES (%s, %s) RETURNING id;",
        (user_id, time_value)
    )
    new_id = cur.fetchone()
    if new_id:
        new_id = new_id[0]
    else:
        new_id = None
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Time added", "id": new_id}), 201


# Delete a time
@times_bp.route("/<int:time_id>", methods=["DELETE"])
def delete_time(time_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM times WHERE id = %s RETURNING id;", (time_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if deleted:
        return jsonify({"message": "Time deleted", "id": deleted[0]}), 200
    else:
        return jsonify({"error": "Time not found"}), 404
