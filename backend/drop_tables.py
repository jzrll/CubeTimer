from services.db import get_db_connection

def drop_tables():
    conn = get_db_connection()
    cur = conn.cursor()

    # drop child tables first
    cur.execute("DROP TABLE IF EXISTS times;")
    cur.execute("DROP TABLE IF EXISTS users;")

    conn.commit()
    cur.close()
    conn.close()
    print("Tables dropped successfully!")

if __name__ == "__main__":
    drop_tables()
