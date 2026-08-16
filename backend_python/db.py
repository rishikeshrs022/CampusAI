import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "campusai.db")
DATA_SQL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "data.sql")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    print("CampusAI DB: Checking database schema...")
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS departments (
        dept_key TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        programs TEXT NOT NULL,
        students_count INTEGER NOT NULL,
        sections INTEGER NOT NULL,
        tuition_fee TEXT NOT NULL,
        lab_fee TEXT NOT NULL,
        exam_fee TEXT NOT NULL,
        total_fee TEXT NOT NULL,
        facilities TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        department TEXT NOT NULL,
        academic_year INTEGER NOT NULL,
        phone TEXT NOT NULL,
        attendance REAL NOT NULL,
        cgpa REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        ref_id TEXT,
        FOREIGN KEY (ref_id) REFERENCES students(id) ON DELETE SET NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS faculty (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        department TEXT NOT NULL,
        designation TEXT NOT NULL,
        experience INTEGER NOT NULL,
        status TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS courses (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        semester INTEGER NOT NULL,
        faculty TEXT NOT NULL,
        credits INTEGER NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        department TEXT NOT NULL,
        academic_year INTEGER NOT NULL,
        student_id TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS examinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        department TEXT NOT NULL,
        semester INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        room TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        available_quantity INTEGER NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS library_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        student_name TEXT NOT NULL,
        issue_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        return_date TEXT,
        status TEXT NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_history (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        topic TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        priority TEXT NOT NULL,
        created_by TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        organizer TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # Ensure profile_pic and blood_group columns exist in students table
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN profile_pic TEXT;")
    except sqlite3.OperationalError:
        pass
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN blood_group TEXT DEFAULT 'O +ve';")
    except sqlite3.OperationalError:
        pass

    conn.commit()

    # Seed check: if users table is empty, run seed data.sql
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        print("CampusAI DB: Seeding default database values...")
        if os.path.exists(DATA_SQL_PATH):
            with open(DATA_SQL_PATH, "r", encoding="utf-8") as f:
                sql_script = f.read()
                # Run seed queries
                cursor.executescript(sql_script)
                conn.commit()
                print("CampusAI DB: Seeding completed.")
        else:
            print("CampusAI DB: Warning - Seed data.sql file not found.")

    conn.close()

if __name__ == "__main__":
    init_db()
