-- ========================================================
-- CampusAI - MySQL Database Schema
-- Project: CampusAI - Smart College Assistant
-- ========================================================

CREATE DATABASE IF NOT EXISTS campusai_db;
USE campusai_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    dept_key VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    programs TEXT NOT NULL,
    students_count INT NOT NULL DEFAULT 0,
    sections INT NOT NULL DEFAULT 0,
    tuition_fee VARCHAR(50) NOT NULL,
    lab_fee VARCHAR(50) NOT NULL,
    exam_fee VARCHAR(50) NOT NULL,
    total_fee VARCHAR(50) NOT NULL,
    facilities TEXT NOT NULL
);

-- 2. Students Table (Stores Academic and Personal Profiles)
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    attendance DOUBLE NOT NULL DEFAULT 0.0,
    cgpa DOUBLE NOT NULL DEFAULT 0.0
);

-- 3. Users Table (Handles Login Credentials & RBAC Roles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- BCrypt hashed passwords
    role VARCHAR(50) NOT NULL, -- ROLE_STUDENT, ROLE_ADMIN
    ref_id VARCHAR(50),
    FOREIGN KEY (ref_id) REFERENCES students(id) ON DELETE SET NULL
);

-- 4. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    experience INT NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    credits INT NOT NULL
);

-- 6. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 7. Examinations Table
CREATE TABLE IF NOT EXISTS examinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    date VARCHAR(10) NOT NULL,
    time VARCHAR(20) NOT NULL,
    room VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- 8. Books Table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    available_quantity INT NOT NULL DEFAULT 1
);

-- 9. Library Transactions Table
CREATE TABLE IF NOT EXISTS library_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    issue_date VARCHAR(10) NOT NULL,
    due_date VARCHAR(10) NOT NULL,
    return_date VARCHAR(10) NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 10. Chat History Table (Stores logs for AI chatbot analytics)
CREATE TABLE IF NOT EXISTS chat_history (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    topic VARCHAR(50) NOT NULL, -- timings, departments, fees, placements, etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- 11. Notices Table (Announcements published by Admins)
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL, -- AI generated summary keypoints
    date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    category VARCHAR(50) NOT NULL, -- Exams, Placements, Events, General
    priority VARCHAR(50) NOT NULL DEFAULT 'Normal', -- Normal, Important, Urgent
    created_by VARCHAR(100) NOT NULL DEFAULT 'Administrator'
);

-- 12. Events Table (Upcoming campus academic/cultural calendar)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    time VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    organizer VARCHAR(100) NOT NULL DEFAULT 'Campus Board',
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming'
);
