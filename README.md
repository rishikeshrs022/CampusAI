# CampusAI - Smart College Assistant

CampusAI is a full-stack, futuristic, AI-powered College Management Chatbot System. It is designed to act as a premium, modern portal where students, staff, and visitors can interact with a virtual assistant to retrieve campus information, track academic performance, plan career specializations, and summarize lengthy announcements.

---

## Key Features

1. **AI-Powered College Chatbot**:
   - Built-in Natural Language Processing (NLP) matching key subjects: timings, fees, courses, placements, exam calendars, hostel guidelines, libraries, and faculty details.
   - Quick replies and rich chat history logging.
2. **Web Voice Assistant**:
   - Hands-free operation using the HTML5 Web Speech API (Speech Recognition for typing, and Speech Synthesis for reading replies).
3. **Smart Notice Analyzer**:
   - Extracts long notice board announcements into core bulleted summaries in real-time, helping students digest circulars immediately.
4. **Student Performance Predictor**:
   - Calculates and predicts upcoming semester GPA based on current CGPA and attendance levels, offering actionable feedback to prevent exam blocks.
5. **AI Career Assistant**:
   - Dynamically recommends roadmap tracks, core skill matrices, and targeted online courses based on student interest categories (e.g. Web Dev, AI/ML, Cloud, Security).
6. **Robust Admin Dashboard**:
   - Form wizards for student enrollment, publishing notices, and scheduling events.
   - Self-contained Canvas-based analytics charting bot topics and total weekly traffic.
7. **Premium Glassmorphic UI**:
   - Deep blue and purple neon themes, background blurs, glowing card overlays, micro-hover states, dark/light toggle, and alert toast banners.

---

## Project Folder Structure

```
campusai-smart-college-assistant/
├── frontend/                     # Modern Single-Page Application (SPA)
│   ├── index.html                # Main UI Shell
│   ├── css/
│   │   └── style.css             # Glassmorphic custom theme
│   └── js/
│       ├── app.js                # Core UI router, analyzer, predictor, and admin forms
│       ├── mockData.js           # Client-side LocalStorage DB & NLP knowledgebase
│       └── voice.js              # Speech to text & Text to speech integration
├── backend/                      # Java Spring Boot Maven codebase
│   ├── pom.xml                   # Project dependencies (Web, JPA, Security, Lombok, MySQL)
│   └── src/
│       └── main/
│           ├── java/com/campusai/assistant/
│           │   ├── CampusAiApplication.java    # Main App Launcher
│           │   ├── config/
│           │   │   └── SecurityConfig.java     # Spring Security Configuration
│           │   ├── controller/
│           │   │   ├── HomeController.java      # Page routing controller
│           │   │   ├── LoginController.java     # Auth API controller
│           │   │   ├── StudentController.java   # Student profiles REST API
│           │   │   └── ChatController.java      # NLP chatbot controller
│           │   ├── entity/
│           │   │   ├── Student.java             # JPA Student model
│           │   │   ├── User.java                # JPA Security User model
│           │   │   └── ChatMessage.java         # JPA Chat history log model
│           │   ├── repository/
│           │   │   ├── StudentRepository.java
│           │   │   ├── UserRepository.java
│           │   │   └── ChatRepository.java
│           │   └── service/
│           │       ├── StudentService.java      # Encrypts passwords, manages users
│           │       ├── AuthenticationService.java  # Custom UserDetailsService provider
│           │       └── ChatbotService.java      # Server NLP logic
│           └── resources/
│               ├── application.properties       # Database credentials
│               └── static/                      # Bundled copy of frontend assets
├── database/
│   ├── schema.sql                # MySQL DB Schema DDL table creation
│   └── data.sql                  # Initial mock seeding with pre-hashed BCrypt values
├── docs/
│   └── api_documentation.md      # API Reference manual
└── README.md                     # This documentation file
```

---

## Presentation & Running Instructions

The project is structured with a **Dual-Mode Frontend**. This allows you to immediately run and demonstrate the fully functional application in "Mock Mode" directly in your browser without any setup, while also containing a production-ready Java backend and MySQL schema.

### Method 1: Instant Presentation (Mock Local Storage Mode)
1. Navigate to the `frontend/` directory.
2. Double-click `index.html` to open it in any modern browser (Google Chrome or Microsoft Edge recommended for voice assistant features).
3. The application will detect the absence of the backend API and automatically initialize a simulated relational database inside your browser's **Local Storage**, loaded with all mock students, admin accounts, and notice schedules.
4. You can login, log out, analyze notices, get career advice, talk to the bot, enroll students, and watch analytics graphs draw in real-time. Any changes you make (e.g. adding students or publishing announcements) will persist on page refresh!

### Method 2: Live Backend Presentation (Spring Boot + MySQL)
1. **Import Database**:
   - Start your local MySQL server.
   - Run the commands inside `database/schema.sql` to create `campusai_db` and its tables.
   - Run the commands inside `database/data.sql` to populate initial records.
2. **Configure Spring Boot**:
   - Open `backend/src/main/resources/application.properties`.
   - Update `spring.datasource.username` and `spring.datasource.password` to match your local MySQL settings.
3. **Compile and Run**:
   - Open the `backend/` folder in your IDE (IntelliJ IDEA or Eclipse) as a Maven Project, or run from terminal:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```
   - The server will boot on port `8080` and serve the static files from `/static/`.
4. **Access the Live Portal**:
   - Visit `http://localhost:8080/` in your browser. All authentication, student management, and chatbot logs will save live to your MySQL database.

---

## Test Login Credentials

Use the following accounts for login testing and project demonstration:

### 1. Student Portal
- **Username / Student ID**: `STUDENT001`
- **Password**: `password123`
- *(Additional student logins: `STUDENT002`, `STUDENT003`)*

### 2. Admin Portal
- **Username**: `admin`
- **Password**: `admin123`
