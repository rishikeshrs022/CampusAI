# /// script
# dependencies = [
#   "flask",
#   "flask-cors",
#   "bcrypt"
# ]
# ///

import os
import base64
import datetime
import sqlite3
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
DB_PATH = os.path.join(os.path.dirname(__file__), "campusai.db")

# Chat Answers Mapping (Aligns with Spring Boot & Frontend responses)
CHAT_ANSWERS = {
    "timings": "CampusAI campus operations run from 8:30 AM to 3:30 PM, Monday through Friday. The campus library remains open from 8:00 AM to 8:00 PM daily for reference study.",
    "admission": "Admissions for the academic year 2026 are open. Applications can be submitted online via our admissions portal or in person at the administration office. Selection is based on merit and counseling seat allocations.",
    "fees": "Tuition fees vary by department. Arts courses start at ₹30,000/year, Science programs at ₹45,000/year, and advanced programs like AI & ML at ₹55,000/year. Payments can be split by semester.",
    "exams": "Internal assessments are scheduled for August 20, 2026. Semester End Assessments will commence on November 18, 2026. Hall tickets will be released to eligible candidates starting November 12.",
    "placements": "Our Placement Cell secures excellent career pathways. Over 86% of students were placed last year. High-profile recruiters include Google visiting on August 24, 2026, offering packages up to ₹18 LPA.",
    "hostel": "Campus residential boarding provides separate boys and girls hostels. Facilities include study areas, Wi-Fi, laundry, and a hygienic mess. Hostel boarding fees are ₹65,000 per academic year.",
    "library": "Our library houses over 55,000 volumes, academic journals, and digital e-learning portals. Operating hours are 8:00 AM to 8:00 PM, and students can check out up to 3 books simultaneously."
}

def map_department(d):
    if not d: return None
    programs = d["programs"]
    if isinstance(programs, str):
        programs = [p.strip() for p in programs.split(",") if p.strip()]
    return {
        "deptKey": d["dept_key"],
        "name": d["name"],
        "icon": d["icon"],
        "programs": programs,
        "studentsCount": d["students_count"],
        "sections": d["sections"],
        "tuitionFee": d["tuition_fee"],
        "labFee": d["lab_fee"],
        "examFee": d["exam_fee"],
        "totalFee": d["total_fee"],
        "facilities": d["facilities"]
    }

def map_student(s):
    if not s: return None
    return {
        "id": s["id"],
        "name": s["name"],
        "email": s["email"],
        "password": s["password"],
        "department": s["department"],
        "year": s["academic_year"],
        "phone": s["phone"],
        "attendance": s["attendance"],
        "cgpa": s["cgpa"]
    }

def map_user(u):
    if not u: return None
    return {
        "id": u["id"],
        "username": u["username"],
        "password": u["password"],
        "role": u["role"],
        "refId": u["ref_id"]
    }

def map_attendance(a):
    if not a: return None
    return {
        "id": a["id"],
        "date": a["date"],
        "department": a["department"],
        "year": a["academic_year"],
        "studentId": a["student_id"],
        "status": a["status"]
    }

def map_examination(e):
    if not e: return None
    return {
        "id": e["id"],
        "examName": e["exam_name"],
        "subject": e["subject"],
        "department": e["department"],
        "semester": e["semester"],
        "date": e["date"],
        "time": e["time"],
        "room": e["room"],
        "status": e["status"]
    }

def map_book(b):
    if not b: return None
    return {
        "id": b["id"],
        "title": b["title"],
        "author": b["author"],
        "isbn": b["isbn"],
        "category": b["category"],
        "quantity": b["quantity"],
        "availableQuantity": b["available_quantity"]
    }

def map_notice(n):
    if not n: return None
    return {
        "id": n["id"],
        "title": n["title"],
        "content": n["content"],
        "summary": n["summary"],
        "date": n["date"],
        "category": n["category"],
        "priority": n["priority"],
        "createdBy": n["created_by"]
    }

def map_chat(c):
    if not c: return None
    return {
        "id": c["id"],
        "studentId": c["student_id"],
        "question": c["question"],
        "answer": c["answer"],
        "topic": c["topic"],
        "timestamp": c["timestamp"]
    }

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Basic Authentication Parsers
def check_auth(auth_header):
    if not auth_header or not auth_header.startswith("Basic "):
        return None
    try:
        encoded = auth_header.split(" ")[1]
        decoded = base64.b64decode(encoded).decode("utf-8")
        username, password = decoded.split(":", 1)
        return username, password
    except Exception:
        return None

def get_authenticated_user():
    auth_header = request.headers.get("Authorization")
    creds = check_auth(auth_header)
    if not creds:
        return None
    username, password = creds
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?;", (username,))
    user = cursor.fetchone()
    
    # Fallback: check student email login
    if not user:
        cursor.execute("SELECT * FROM students WHERE email = ?;", (username,))
        student = cursor.fetchone()
        if student:
            cursor.execute("SELECT * FROM users WHERE username = ?;", (student["id"],))
            user = cursor.fetchone()
            
    if user:
        hashed_pwd = user["password"]
        if hashed_pwd.startswith("$2a$") or hashed_pwd.startswith("$2b$"):
            formatted_hash = hashed_pwd.replace("$2y$", "$2b$").encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), formatted_hash):
                user_dict = dict(user)
                conn.close()
                return user_dict
        elif password == hashed_pwd:
            user_dict = dict(user)
            conn.close()
            return user_dict
            
    conn.close()
    return None

def require_role(*roles):
    user = get_authenticated_user()
    if not user:
        return None, jsonify({"success": False, "message": "Unauthorized"}), 401
    if user["role"] not in roles:
        return None, jsonify({"success": False, "message": "Forbidden"}), 403
    return user, None, None

# --- Page forwarding routing (Single Page App Static Fallback) ---
@app.route("/")
@app.route("/login")
@app.route("/admin/<path:subpath>")
@app.route("/student/<path:subpath>")
def serve_index(subpath=None):
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

# --- API Mappings ---

# Login Mapping
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check user direct username
    cursor.execute("SELECT * FROM users WHERE username = ?;", (username,))
    user = cursor.fetchone()
    
    # Fallback: check if username is a student email
    if not user:
        cursor.execute("SELECT * FROM students WHERE email = ?;", (username,))
        student = cursor.fetchone()
        if student:
            cursor.execute("SELECT * FROM users WHERE username = ?;", (student["id"],))
            user = cursor.fetchone()
            
    if user:
        hashed_pwd = user["password"]
        if hashed_pwd.startswith("$2a$") or hashed_pwd.startswith("$2b$"):
            formatted_hash = hashed_pwd.replace("$2y$", "$2b$").encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), formatted_hash):
                conn.close()
                return jsonify({
                    "success": True,
                    "username": user["username"],
                    "role": user["role"],
                    "refId": user["ref_id"]
                })
        elif password == hashed_pwd:
            conn.close()
            return jsonify({
                "success": True,
                "username": user["username"],
                "role": user["role"],
                "refId": user["ref_id"]
            })
            
    conn.close()
    return jsonify({"success": False, "message": "Invalid username or password"}), 401


@app.route("/api/google-login", methods=["POST"])
def google_login_sync():
    data = request.json or {}
    email = data.get("email")
    name = data.get("name")
    uid = data.get("uid")
    
    if not email or not uid:
        return jsonify({"success": False, "message": "Email and UID required"}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if student already exists by email
    cursor.execute("SELECT * FROM students WHERE email = ?;", (email,))
    student = cursor.fetchone()
    
    if not student:
        # Create student profile
        # Use UID as the student ID
        student_id = f"STU_G_{uid[:8].upper()}"
        
        # Insert student record
        cursor.execute("""
            INSERT INTO students (id, name, email, password, department, academic_year, phone, attendance, cgpa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (student_id, name or "Google Student", email, "GOOGLE_AUTH", "B.Sc Data Science", 1, "N/A", 100.0, 4.0))
        
        # Insert user record linked to student
        cursor.execute("""
            INSERT INTO users (id, username, password, role, ref_id)
            VALUES (?, ?, ?, ?, ?);
        """, (student_id, email, "GOOGLE_AUTH", "ROLE_STUDENT", student_id))
        
        conn.commit()
        
        # Fetch the newly created user
        cursor.execute("SELECT * FROM users WHERE id = ?;", (student_id,))
        user = cursor.fetchone()
    else:
        student_id = student["id"]
        # Make sure there is a user row linked to this student
        cursor.execute("SELECT * FROM users WHERE ref_id = ?;", (student_id,))
        user = cursor.fetchone()
        if not user:
            # If user row doesn't exist for some reason, create it
            cursor.execute("""
                INSERT INTO users (id, username, password, role, ref_id)
                VALUES (?, ?, ?, ?, ?);
            """, (student_id, email, "GOOGLE_AUTH", "ROLE_STUDENT", student_id))
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE id = ?;", (student_id,))
            user = cursor.fetchone()
            
    conn.close()
    
    return jsonify({
        "success": True,
        "username": user["username"],
        "role": user["role"],
        "refId": user["ref_id"],
        "name": name or student["name"]
    })


# Users Endpoints
@app.route("/api/users", methods=["GET"])
def get_users():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role, ref_id FROM users;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_user(r) for r in rows])

@app.route("/api/users", methods=["POST"])
def save_user():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    pwd = data.get("password")
    
    # Encrypt password using bcrypt if needed
    if pwd and not pwd.startswith("$2a$") and not pwd.startswith("$2b$"):
        hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        data["password"] = hashed
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO users (id, username, password, role, ref_id)
    VALUES (:id, :username, :password, :role, :refId);
    """, {
        "id": data.get("id"),
        "username": data.get("username"),
        "password": data.get("password"),
        "role": data.get("role"),
        "refId": data.get("refId")
    })
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "User saved successfully"})


# Students Endpoints
@app.route("/api/students", methods=["GET"])
def get_students():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_student(r) for r in rows])

@app.route("/api/students/<id>", methods=["GET"])
def get_student_by_id(id):
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = ?;", (id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify(map_student(row))
    return jsonify({"message": "Student not found"}), 404

@app.route("/api/students", methods=["POST"])
def save_student():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    academic_year = data.get("academic_year") or data.get("year")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO students (id, name, email, password, department, academic_year, phone, attendance, cgpa)
    VALUES (:id, :name, :email, :password, :department, :academic_year, :phone, :attendance, :cgpa);
    """, {
        "id": data.get("id"),
        "name": data.get("name"),
        "email": data.get("email"),
        "password": data.get("password"),
        "department": data.get("department"),
        "academic_year": academic_year,
        "phone": data.get("phone"),
        "attendance": data.get("attendance"),
        "cgpa": data.get("cgpa")
    })
    conn.commit()
    conn.close()
    return jsonify(data)

@app.route("/api/students/<id>", methods=["DELETE"])
def delete_student(id):
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE id = ?;", (id,))
    cursor.execute("DELETE FROM users WHERE ref_id = ?;", (id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Student deleted"})


# Departments Endpoints
@app.route("/api/departments", methods=["GET"])
def get_departments():
    # Publicly reachable endpoint to allow initial handshake checks
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM departments;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_department(r) for r in rows])

@app.route("/api/departments", methods=["POST"])
def save_department():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    programs = data.get("programs")
    if isinstance(programs, list):
        programs = ", ".join(programs)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO departments (dept_key, name, icon, programs, students_count, sections, tuition_fee, lab_fee, exam_fee, total_fee, facilities)
    VALUES (:deptKey, :name, :icon, :programs, :studentsCount, :sections, :tuitionFee, :labFee, :examFee, :totalFee, :facilities);
    """, {
        "deptKey": data.get("deptKey"),
        "name": data.get("name"),
        "icon": data.get("icon"),
        "programs": programs,
        "studentsCount": data.get("studentsCount"),
        "sections": data.get("sections"),
        "tuitionFee": data.get("tuitionFee"),
        "labFee": data.get("labFee"),
        "examFee": data.get("examFee"),
        "totalFee": data.get("totalFee"),
        "facilities": data.get("facilities")
    })
    conn.commit()
    conn.close()
    return jsonify(data)

@app.route("/api/departments/<key>", methods=["DELETE"])
def delete_department(key):
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM departments WHERE dept_key = ?;", (key,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Department deleted"})


# Faculty Endpoints
@app.route("/api/faculty", methods=["GET"])
def get_faculty():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM faculty;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/faculty", methods=["POST"])
def save_faculty():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO faculty (id, name, email, phone, department, designation, experience, status)
    VALUES (:id, :name, :email, :phone, :department, :designation, :experience, :status);
    """, {
        "id": data.get("id"),
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "department": data.get("department"),
        "designation": data.get("designation"),
        "experience": data.get("experience"),
        "status": data.get("status")
    })
    conn.commit()
    conn.close()
    return jsonify(data)

@app.route("/api/faculty/<id>", methods=["DELETE"])
def delete_faculty(id):
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM faculty WHERE id = ?;", (id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Faculty deleted"})


# Courses Endpoints
@app.route("/api/courses", methods=["GET"])
def get_courses():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/courses", methods=["POST"])
def save_course():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO courses (code, name, department, semester, faculty, credits)
    VALUES (:code, :name, :department, :semester, :faculty, :credits);
    """, {
        "code": data.get("code"),
        "name": data.get("name"),
        "department": data.get("department"),
        "semester": data.get("semester"),
        "faculty": data.get("faculty"),
        "credits": data.get("credits")
    })
    conn.commit()
    conn.close()
    return jsonify(data)

@app.route("/api/courses/<code>", methods=["DELETE"])
def delete_course(code):
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM courses WHERE code = ?;", (code,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Course deleted"})


# Attendance Endpoints
@app.route("/api/attendance", methods=["GET"])
def get_attendance():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM attendance;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_attendance(r) for r in rows])

@app.route("/api/attendance", methods=["POST"])
def save_attendance():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO attendance (date, department, academic_year, student_id, status)
    VALUES (:date, :department, :academic_year, :studentId, :status);
    """, {
        "date": data.get("date"),
        "department": data.get("department"),
        "academic_year": data.get("academic_year"),
        "studentId": data.get("studentId"),
        "status": data.get("status")
    })
    conn.commit()
    conn.close()
    return jsonify(data)


# Examinations Endpoints
@app.route("/api/examinations", methods=["GET"])
def get_examinations():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM examinations;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_examination(r) for r in rows])

@app.route("/api/examinations", methods=["POST"])
def save_examination():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO examinations (id, exam_name, subject, department, semester, date, time, room, status)
    VALUES (:id, :examName, :subject, :department, :semester, :date, :time, :room, :status);
    """, {
        "id": data.get("id"),
        "examName": data.get("examName"),
        "subject": data.get("subject"),
        "department": data.get("department"),
        "semester": data.get("semester"),
        "date": data.get("date"),
        "time": data.get("time"),
        "room": data.get("room"),
        "status": data.get("status")
    })
    conn.commit()
    conn.close()
    return jsonify(data)


# Library Endpoints
@app.route("/api/library/books", methods=["GET"])
def get_library_books():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_book(r) for r in rows])

@app.route("/api/library/books", methods=["POST"])
def save_library_book():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO books (id, title, author, isbn, category, quantity, available_quantity)
    VALUES (:id, :title, :author, :isbn, :category, :quantity, :availableQuantity);
    """, {
        "id": data.get("id"),
        "title": data.get("title"),
        "author": data.get("author"),
        "isbn": data.get("isbn"),
        "category": data.get("category"),
        "quantity": data.get("quantity"),
        "availableQuantity": data.get("availableQuantity")
    })
    conn.commit()
    conn.close()
    return jsonify(data)

@app.route("/api/library/books/<id>", methods=["DELETE"])
def delete_library_book(id):
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM books WHERE id = ?;", (id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Book deleted"})


# Events Endpoints
@app.route("/api/events", methods=["GET"])
def get_events():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/api/events", methods=["POST"])
def save_event():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO events (id, title, date, time, location, description, organizer, status)
    VALUES (:id, :title, :date, :time, :location, :description, :organizer, :status);
    """, {
        "id": data.get("id"),
        "title": data.get("title"),
        "date": data.get("date"),
        "time": data.get("time"),
        "location": data.get("location"),
        "description": data.get("description"),
        "organizer": data.get("organizer"),
        "status": data.get("status")
    })
    conn.commit()
    conn.close()
    return jsonify(data)


# Notices Endpoints
@app.route("/api/notices", methods=["GET"])
def get_notices():
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notices;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_notice(r) for r in rows])

@app.route("/api/notices", methods=["POST"])
def save_notice():
    user, response, code = require_role("ROLE_ADMIN")
    if response: return response, code
    
    data = request.json or {}
    content = data.get("content", "")
    
    # Generate AI summary if not explicitly provided
    if not data.get("summary"):
        sentences = [s.strip() for s in content.split(".") if len(s.strip()) > 10]
        data["summary"] = " ".join(sentences[:3]) + "." if sentences else content
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO notices (id, title, content, summary, date, category, priority, created_by)
    VALUES (:id, :title, :content, :summary, :date, :category, :priority, :createdBy);
    """, {
        "id": data.get("id"),
        "title": data.get("title"),
        "content": content,
        "summary": data.get("summary"),
        "date": data.get("date"),
        "category": data.get("category"),
        "priority": data.get("priority"),
        "createdBy": data.get("createdBy")
    })
    conn.commit()
    conn.close()
    return jsonify(data)


# AI Chatbot Endpoints
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    student_id = data.get("studentId") or "GUEST"
    question = data.get("question", "")
    
    # Process NLP Query
    q = question.lower().strip().strip("?").strip("!").strip(".")
    answer = "I'm sorry, I couldn't find a direct answer. CampusAI can help you with: <b>College timings, Departments, Courses available, Admission process, Fee details, Exam dates, Placement details, Hostel facilities, Library timings, and Faculty profiles</b>. Please try rephrasing your question!"
    topic = "other"
    
    if q in ["hello", "hi", "hey", "greetings"] or any(q.startswith(x) for x in ["hello ", "hi ", "hey ", "greetings "]):
        answer = "Hello! How can I help you? I can assist you with details regarding: <b>College timings, Departments, Courses available, Admission process, Fee details, Exam dates, Placement details, Hostel facilities, Library timings, and Faculty profiles</b>."
        topic = "greetings"
    else:
        for key, value in CHAT_ANSWERS.items():
            if key in q or (key == "timings" and ("hours" in q or "time" in q or "schedule" in q)):
                answer = value
                topic = key
                break
            
    # Fallback checks for departments/courses/faculty
    if topic == "other":
        if "department" in q or "branch" in q or "stream" in q:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM departments;")
            names = [f"{i+1}. <b>{r['name']}</b>" for i, r in enumerate(cursor.fetchall())]
            conn.close()
            answer = f"CampusAI features {len(names)} premier Arts, Science, & Commerce departments:<br>" + "<br>".join(names) + "<br>All departments are NAAC A++ accredited."
            topic = "departments"
        elif "course" in q or "program" in q or "degree" in q:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT code, name, department FROM courses;")
            names = [f"• <b>{r['code']}</b>: {r['name']} ({r['department']})" for r in cursor.fetchall()]
            conn.close()
            answer = "We offer the following academic course curriculums:<br>" + "<br>".join(names)
            topic = "courses"
        elif "faculty" in q or "teacher" in q or "professor" in q:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT name, designation, department FROM faculty LIMIT 5;")
            names = [f"• <b>{r['name']}</b> - {r['designation']} ({r['department']})" for r in cursor.fetchall()]
            conn.close()
            answer = "We have over 86 experienced faculty members. Here are some of our professors:<br>" + "<br>".join(names)
            topic = "faculty"
            
    # Save chat msg in history
    msg_id = "MSG" + str(int(datetime.datetime.now().timestamp() * 1000))
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO chat_history (id, student_id, question, answer, topic, timestamp)
    VALUES (?, ?, ?, ?, ?, ?);
    """, (msg_id, student_id, question, answer, topic, timestamp))
    conn.commit()
    conn.close()
    
    return jsonify({
        "id": msg_id,
        "studentId": student_id,
        "question": question,
        "answer": answer,
        "topic": topic,
        "timestamp": timestamp
    })

@app.route("/api/chat/history", methods=["GET"])
@app.route("/api/chat/history/<studentId>", methods=["GET"])
def chat_history(studentId=None):
    user, response, code = require_role("ROLE_STUDENT", "ROLE_ADMIN")
    if response: return response, code
    
    conn = get_db_connection()
    cursor = conn.cursor()
    if studentId:
        cursor.execute("SELECT * FROM chat_history WHERE student_id = ? ORDER BY timestamp ASC;", (studentId,))
    else:
        cursor.execute("SELECT * FROM chat_history ORDER BY timestamp ASC;")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([map_chat(r) for r in rows])


if __name__ == "__main__":
    # Auto-initialize database tables and seeds if not already initialized
    from db import init_db
    init_db()
    
    print("CampusAI Backend: Launching Flask App on http://localhost:8080")
    app.run(host="0.0.0.0", port=8080, debug=True)
