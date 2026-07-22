# CampusAI - REST API Reference Documentation

This document describes the REST API endpoints provided by the CampusAI Spring Boot backend. All requests and responses should use the `application/json` content type.

---

## 1. Authentication API

### POST /api/login
Validates user credentials and retrieves user roles.

- **Request Body**:
```json
{
  "username": "STUDENT001",
  "password": "password123"
}
```

- **Response (Success - HTTP 200 OK)**:
```json
{
  "success": true,
  "username": "STUDENT001",
  "role": "ROLE_STUDENT",
  "refId": "STUDENT001"
}
```

- **Response (Failure - HTTP 401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid username or password."
}
```

---

## 2. Student API

### GET /api/students
Retrieves a list of all enrolled students. Requester must have `ROLE_STUDENT` or `ROLE_ADMIN`.

- **Response (HTTP 200 OK)**:
```json
[
  {
    "id": "STUDENT001",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@campusai.edu",
    "department": "Information Technology",
    "year": 3,
    "phone": "+91 98765 43210",
    "attendance": 86.5,
    "cgpa": 8.75
  },
  {
    "id": "STUDENT002",
    "name": "Priya Patel",
    "email": "priya.patel@campusai.edu",
    "department": "Computer Science & Engineering",
    "year": 4,
    "phone": "+91 98765 43211",
    "attendance": 92.0,
    "cgpa": 9.15
  }
]
```

### GET /api/students/{id}
Retrieves detailed profile info for a specific student. Requester must have `ROLE_STUDENT` or `ROLE_ADMIN`.

- **Response (HTTP 200 OK)**:
```json
{
  "id": "STUDENT001",
  "name": "Rahul Sharma",
  "email": "rahul.sharma@campusai.edu",
  "department": "Information Technology",
  "year": 3,
  "phone": "+91 98765 43210",
  "attendance": 86.5,
  "cgpa": 8.75
}
```

- **Response (HTTP 404 Not Found)**:
Returned if no student matches the specified Register ID.

### POST /api/students
Enrolls a new student. Also mirrors the student registration into the `users` credentials table with a default password (`password123`). Requester must have `ROLE_ADMIN`.

- **Request Body**:
```json
{
  "id": "STUDENT004",
  "name": "Anand Kumar",
  "email": "anand.k@campusai.edu",
  "department": "Information Technology",
  "year": 1,
  "phone": "+91 99999 88888",
  "attendance": 85.0,
  "cgpa": 8.50
}
```

- **Response (HTTP 201 Created)**:
```json
{
  "id": "STUDENT004",
  "name": "Anand Kumar",
  "email": "anand.k@campusai.edu",
  "department": "Information Technology",
  "year": 1,
  "phone": "+91 99999 88888",
  "attendance": 85.0,
  "cgpa": 8.50
}
```

### DELETE /api/students/{id}
Removes a student profile and clean up associated user login credentials. Requester must have `ROLE_ADMIN`.

- **Response (HTTP 240 No Content)**:
Profile deleted successfully.

---

## 3. Chatbot API

### POST /api/chat
Submits a query to the NLP engine. Automatically logs query to the chat history database.

- **Request Body**:
```json
{
  "studentId": "STUDENT001",
  "question": "What are the college timings?"
}
```

- **Response (HTTP 200 OK)**:
```json
{
  "answer": "College operating hours are from <b>8:30 AM to 3:30 PM</b>, Monday through Friday. Lunch break is from <b>12:15 PM to 1:15 PM</b>.",
  "topic": "timings"
}
```

### GET /api/chat/history
Retrieves full chatbot history log across all users. Useful for admin analytics dashboard panels. Requester must have `ROLE_ADMIN`.

- **Response (HTTP 200 OK)**:
```json
[
  {
    "id": "MSG001",
    "studentId": "STUDENT001",
    "question": "What are the college timings?",
    "answer": "College operating hours are from 8:30 AM to 3:30 PM...",
    "topic": "timings",
    "timestamp": "2026-06-13T10:10:00"
  }
]
```

### GET /api/chat/history/{studentId}
Retrieves interaction log history for a specific student. Requester must have `ROLE_STUDENT` or `ROLE_ADMIN`.

- **Response (HTTP 200 OK)**:
```json
[
  {
    "id": "MSG001",
    "studentId": "STUDENT001",
    "question": "What are the college timings?",
    "answer": "College operating hours are from 8:30 AM to 3:30 PM...",
    "topic": "timings",
    "timestamp": "2026-06-13T10:10:00"
  }
]
```
