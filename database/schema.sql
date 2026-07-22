-- ========================================================
-- CampusAI - MySQL Database Schema
-- Project: CampusAI - Smart College Assistant
-- ========================================================

CREATE DATABASE IF NOT EXISTS campusai_db;
USE campusai_db;

-- 1. Users Table (Handles Login Credentials & RBAC Roles)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- BCrypt hashed passwords
    role VARCHAR(50) NOT NULL, -- ROLE_STUDENT, ROLE_ADMIN
    ref_id VARCHAR(50) -- Links to students.id or remains null for admin
);

-- 2. Students Table (Stores Academic and Personal Profiles)
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    attendance DOUBLE NOT NULL DEFAULT 0.0,
    cgpa DOUBLE NOT NULL DEFAULT 0.0
);

-- 3. Chat History Table (Stores logs for AI chatbot analytics)
CREATE TABLE IF NOT EXISTS chat_history (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    topic VARCHAR(50) NOT NULL, -- timings, departments, fees, placements, etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- 4. Notices Table (Announcements published by Admins)
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL, -- AI generated summary keypoints
    date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    category VARCHAR(50) NOT NULL -- Exams, Placements, Events, General
);

-- 5. Events Table (Upcoming campus academic/cultural calendar)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    time VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
