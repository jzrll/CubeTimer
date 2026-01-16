from flask import Blueprint, request, jsonify
from services.db import get_db_connection

times_bp = Blueprint("times", __name__, url_prefix="/times")


# Get all times for all users
@times_bp.route("/", methods=["GET"])
def get_all_times():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT t.id, t.user_id, t.time, t.created_at, u.username
        FROM times t
        JOIN users u ON t.user_id = u.id
        ORDER BY time ASC
        LIMIT 20;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "user_id": r[1],
            "username": r[4],
            "time": float(r[2]),
            "created_at": r[3].isoformat()
        })
    
    return jsonify(result), 200


# Get all times for a single user
@times_bp.route("/<int:user_id>", methods=["GET"])
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

    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "time": float(r[1]),
            "created_at": r[2].isoformat()
        })
    return jsonify(result), 200


# Add a new time
@times_bp.route("/", methods=["POST"])
def add_time():
    data = request.get_json()
    user_id = data.get("user_id")
    time_value = data.get("time")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO times (user_id, time) VALUES (%s, %s);",
        (user_id, time_value)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Time added"}), 201


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
