/**
 * CampusAI - Mock Database and Knowledge Base
 * Seeds initial data into localStorage and provides helper methods to access and modify data.
 */

const DEFAULT_STUDENTS = [
    {
        id: "STUDENT001",
        name: "Rahul Sharma",
        email: "rahul.sharma@campusai.edu",
        password: "password123", 
        department: "Computer Science & BCA",
        year: 3,
        phone: "+91 98765 43210",
        attendance: 86.5,
        attendanceDetails: [
            { subject: "Web Programming", attended: 36, total: 40, percent: 90.0 },
            { subject: "Database Management Systems", attended: 32, total: 40, percent: 80.0 },
            { subject: "Python for Data Analysis", attended: 35, total: 40, percent: 87.5 },
            { subject: "Software Engineering Core", attended: 34, total: 40, percent: 85.0 },
            { subject: "Discrete Mathematics", attended: 37, total: 42, percent: 88.0 }
        ],
        cgpa: 8.75,
        semesterDetails: [
            { sem: 1, gpa: 8.5 },
            { sem: 2, gpa: 8.65 },
            { sem: 3, gpa: 8.9 },
            { sem: 4, gpa: 8.8 },
            { sem: 5, gpa: 8.9 }
        ],
        marks: [
            { subject: "Web Programming", test1: 85, test2: 90, model: 88 },
            { subject: "Database Management Systems", test1: 78, test2: 82, model: 80 },
            { subject: "Python for Data Analysis", test1: 92, test2: 95, model: 94 },
            { subject: "Software Engineering Core", test1: 88, test2: 86, model: 87 },
            { subject: "Discrete Mathematics", test1: 84, test2: 89, model: 86 }
        ]
    },
    {
        id: "STUDENT002",
        name: "Priya Patel",
        email: "priya.patel@campusai.edu",
        password: "password123",
        department: "Commerce & BBA",
        year: 4,
        phone: "+91 98765 43211",
        attendance: 92.0,
        attendanceDetails: [
            { subject: "Corporate Accounting", attended: 38, total: 40, percent: 95.0 },
            { subject: "Financial Management", attended: 36, total: 40, percent: 90.0 },
            { subject: "Marketing and Advertising", attended: 37, total: 40, percent: 92.5 },
            { subject: "Organizational Behavior", attended: 36, total: 40, percent: 90.0 }
        ],
        cgpa: 9.15,
        semesterDetails: [
            { sem: 1, gpa: 9.0 },
            { sem: 2, gpa: 9.1 },
            { sem: 3, gpa: 9.3 },
            { sem: 4, gpa: 9.2 },
            { sem: 5, gpa: 9.0 },
            { sem: 6, gpa: 9.2 },
            { sem: 7, gpa: 9.35 }
        ],
        marks: [
            { subject: "Corporate Accounting", test1: 95, test2: 94, model: 96 },
            { subject: "Financial Management", test1: 89, test2: 92, model: 91 },
            { subject: "Marketing and Advertising", test1: 90, test2: 91, model: 93 },
            { subject: "Organizational Behavior", test1: 92, test2: 90, model: 92 }
        ]
    },
    {
        id: "STUDENT003",
        name: "Arjun Kumar",
        email: "arjun.kumar@campusai.edu",
        password: "password123",
        department: "Physics",
        year: 2,
        phone: "+91 98765 43212",
        attendance: 74.5,
        attendanceDetails: [
            { subject: "Quantum Mechanics", attended: 28, total: 40, percent: 70.0 },
            { subject: "Mathematical Physics", attended: 30, total: 40, percent: 75.0 },
            { subject: "Solid State Electronics", attended: 29, total: 40, percent: 72.5 },
            { subject: "Nuclear Physics", attended: 32, total: 40, percent: 80.0 }
        ],
        cgpa: 7.20,
        semesterDetails: [
            { sem: 1, gpa: 7.0 },
            { sem: 2, gpa: 7.3 },
            { sem: 3, gpa: 7.10 }
        ],
        marks: [
            { subject: "Quantum Mechanics", test1: 65, test2: 70, model: 68 },
            { subject: "Mathematical Physics", test1: 72, test2: 68, model: 70 },
            { subject: "Solid State Electronics", test1: 63, test2: 74, model: 71 },
            { subject: "Nuclear Physics", test1: 78, test2: 75, model: 76 }
        ]
    }
];

const DEFAULT_USERS = [
    { id: "U001", username: "STUDENT001", password: "password123", role: "ROLE_STUDENT", refId: "STUDENT001" },
    { id: "U002", username: "STUDENT002", password: "password123", role: "ROLE_STUDENT", refId: "STUDENT002" },
    { id: "U003", username: "STUDENT003", password: "password123", role: "ROLE_STUDENT", refId: "STUDENT003" },
    { id: "U004", username: "admin", password: "admin123", role: "ROLE_ADMIN", name: "Rishi", email: "admin@campusai.edu" }
];

const DEFAULT_NOTICES = [
    {
        id: "NOTICE001",
        title: "End Semester Exams Schedule - November 2026",
        date: "2026-06-12",
        category: "Exams",
        content: "The End Semester Exams for all B.Sc, BCA, B.Com, BBA, and B.A programs are scheduled to commence on November 18, 2026. The detailed timetable will be published on the college portal by October 15, 2026. All students must clear their outstanding tuition fees by September 30, 2026, to receive hall tickets. Practical examinations and lab viva sessions will be conducted between November 2 and November 10, 2026. Hall tickets will be issued by the respective heads of departments starting November 12. A minimum attendance of 75% is strictly mandatory to sit for exams.",
        summary: "End Semester Exams commence Nov 18, 2026. Timetable releases by Oct 15. Fees must be cleared by Sept 30. Lab sessions run Nov 2-10. Hall tickets issued from Nov 12. 75% attendance mandatory."
    },
    {
        id: "NOTICE002",
        title: "Google Campus Recruitment Drive 2026",
        date: "2026-06-10",
        category: "Placements",
        content: "We are thrilled to announce that Google will be visiting our campus for a recruitment drive on August 24, 2026, for the role of Software Engineer. Eligibility Criteria: B.Sc CS, BCA, and B.Sc Mathematics students with minimum CGPA of 8.5, no standing backlogs, and excellent coding skills. Package details: Highest compensation package of up to 18 LPA. Interested and eligible candidates must register on the placement portal by June 30, 2026. A mock online coding assessment will be organized by the Placement Cell on July 15, 2026, to prepare registered students.",
        summary: "Google recruiting for Software Engineer on Aug 24, 2026. CS, BCA, and Math eligibility: 8.5+ CGPA, no backlogs. Package: Up to 18 LPA. Register by June 30. Mock coding test on July 15."
    },
    {
        id: "NOTICE003",
        title: "Annual Cultural Fest - 'CAMPUS FLAME 2026'",
        date: "2026-06-08",
        category: "Events",
        content: "Get ready to experience the biggest college festival of the year! 'CAMPUS FLAME 2026' will be held on September 11 and 12, 2026. The event features over 30 inter-collegiate competitions, including battle of bands, fashion show, choreo night, hackathons, and street plays. The chief guest for the inauguration is actor Madhavan. Registration for internal teams opens on June 20, 2026. All classes will remain suspended for the event days. Cash prizes worth ₹5 Lakhs are to be won.",
        summary: "'CAMPUS FLAME 2026' on Sept 11-12, 2026. Over 30 competitions (bands, fashion, hackathon). Chief Guest: Actor Madhavan. Registrations open June 20. Cash prizes of ₹5 Lakhs."
    },
    {
        id: "NOTICE004",
        title: "Annual Sports Meet - 'CAMPUS ATHLETICS 2026'",
        date: "2026-06-13",
        category: "Events",
        content: "We are pleased to announce that the Annual Sports Meet 'CAMPUS ATHLETICS 2026' is scheduled to be held on October 24, 2026, at the college sports ground. Events include 100m, 200m, 400m, relay races, long jump, high jump, shot put, and inter-departmental tournaments for cricket, football, and badminton. Registration for events begins on September 1, 2026, with the physical education director. Cash prizes and rolling trophies will be awarded to the winning departments.",
        summary: "'CAMPUS ATHLETICS 2026' scheduled for October 24, 2026. Includes athletics and team sports (cricket, football, badminton). Register from Sept 1. Trophies & cash prizes for winners."
    },
    {
        id: "NOTICE005",
        title: "Annual Alumni Reunion 2026",
        date: "2026-06-13",
        category: "Events",
        content: "CampusAI Arts & Science College cordially invites all our alumni to the Annual Reunion Meet on December 5, 2026. Reconnect with professors, interact with current students, and witness the growth of our institution. The event includes a panel discussion on industry trends, department visits, and a cultural evening followed by dinner. Registration is free but mandatory via the alumni portal link by November 15, 2026.",
        summary: "Annual Alumni Reunion on December 5, 2026. Reconnect, panel discussions, department visits, and dinner. Free registration on portal by November 15."
    }
];

const DEFAULT_EVENTS = [
    { id: "EVENT001", title: "AI/ML Hackathon 2026", date: "2026-07-05", time: "09:00 AM", location: "Main Seminar Hall", desc: "Build futuristic solutions for social impact using AI." },
    { id: "EVENT002", title: "Google Placement Drive", date: "2026-08-24", time: "08:30 AM", location: "Placement Cell Block B", desc: "Campus recruitment for final year B.Sc CS, BCA, and B.Sc Math." },
    { id: "EVENT003", title: "Campus Flame Cultural Fest", date: "2026-09-11", time: "10:00 AM", location: "Open Air Auditorium", desc: "Annual inter-collegiate cultural extravaganza." },
    { id: "EVENT004", title: "Linguistics & Creative Writing Seminar", date: "2026-10-12", time: "09:30 AM", location: "English Dept Seminar Hall", desc: "Keynotes on contemporary literature, poetry, and content writing." },
    { id: "EVENT005", title: "End Semester Exams", date: "2026-11-18", time: "10:00 AM", location: "Exam Halls A-F", desc: "Semester examinations for all departments." },
    { id: "EVENT006", title: "Annual Sports Meet 2026", date: "2026-10-24", time: "08:00 AM", location: "College Playground", desc: "Inter-departmental track, field, and indoor sports tournaments." },
    { id: "EVENT007", title: "Alumni Meet 2026", date: "2026-12-05", time: "10:30 AM", location: "Main Seminar Hall", desc: "Annual gathering of alumni from all graduated batches." }
];

const CHAT_ANSWERS = {
    timings: "College operating hours are from <b>8:30 AM to 3:30 PM</b>, Monday through Friday. Lunch break is from <b>12:15 PM to 1:15 PM</b>. The library and lab facilities remain open until <b>6:00 PM</b> for research and project work.",
    departments: "CampusAI features 6 premier Arts, Science, & Commerce departments:<br>1. <b>Computer Science & BCA</b><br>2. <b>English Literature</b><br>3. <b>Physics</b><br>4. <b>Chemistry</b><br>5. <b>Mathematics</b><br>6. <b>Commerce & BBA</b><br>All departments are NAAC A++ accredited.",
    courses: "We offer the following undergraduate and postgraduate courses:<br>• <b>B.Sc / BCA</b> (Computer Science, Physics, Chemistry, Math, BCA) - 3 Years<br>• <b>B.A. / B.Com / BBA</b> (English Literature, Commerce, BBA) - 3 Years<br>• <b>M.Sc / M.A / M.Com</b> (Computer Science, English, Commerce) - 2 Years.",
    admission: "Admission is conducted based on Board Exam marks counseling and interview rounds. Contact <b>admissions@campusai.edu</b> or call <b>+91 44 2745 6000</b>.",
    fees: "Tuition Fees structure per academic year:<br>• <b>B.Sc / BCA / BBA</b>: ₹45,000 / year<br>• <b>B.A. / B.Com</b>: ₹35,000 / year<br>• <b>Hostel & Mess Charges</b>: ₹65,000 / year<br>• <b>Transport Fee</b> (optional): ₹20,000 to ₹35,000 based on distance.",
    exams: "Key Exam dates for 2026:<br>• <b>Internal Assessment I</b>: August 20, 2026<br>• <b>Internal Assessment II</b>: October 5, 2026<br>• <b>Practical Exams & Lab Vivas</b>: November 2 - 10, 2026<br>• <b>End Semester Theory Exams</b>: November 18, 2026 onwards.",
    placements: "The Placement Cell has a stellar record! <b>95% of students</b> were placed in 2025. Over 120 companies visit campus annually. <b>Top Recruiters</b>: Google, Deloitte, TCS, Infosys, Wipro, Cognizant.<br>• <b>Highest Package</b>: ₹18 LPA (Google)<br>• <b>Average Package</b>: ₹5.2 LPA.",
    hostel: "Separate AC and non-AC hostel buildings exist for boys and girls. Facilities include:<br>• 24/7 Wi-Fi connectivity (100 Mbps)<br>• Modern gym & indoor sports complex<br>• Pure vegetarian & non-vegetarian mess food<br>• On-call doctor & 24/7 emergency vehicle.",
    library: "The Central Library houses over <b>55,000 books</b>, 150 print journals, and has subscription ties with IEEE, Springer, and ScienceDirect. Timings: <b>8:00 AM to 8:00 PM</b> (all working days). Digital library has 40 high-speed computers for student research.",
    faculty: "We have over <b>150 experienced faculty members</b> across departments. More than 45% hold Ph.D. degrees from premium institutions like IITs, NITs, and Anna University. Student-to-faculty ratio is maintained at a healthy <b>1:15</b>."
};

const CAREER_GUIDE = {
    webdev: {
        title: "Full-Stack Web Developer",
        skills: ["HTML5 / CSS3 / JavaScript (ES6+)", "React.js or Vue.js", "Node.js & Express.js", "REST APIs & Databases (SQL / NoSQL)", "Git & CI/CD Pipelines"],
        courses: ["Vite + React Complete Guide (Coursera)", "Node.js Bootcamp (Udemy)", "Architecting RESTful APIs (LinkedIn Learning)"],
        roadmap: "Begin with frontend basics (HTML, CSS, Vanilla JS) -> Master React -> Build Node/Express backends -> Integrate Databases -> Learn Docker & Cloud Deployment."
    },
    aiml: {
        title: "AI / Machine Learning Engineer",
        skills: ["Python Programming", "Linear Algebra & Probability", "Pandas, NumPy, & Scikit-Learn", "Deep Learning Frameworks (TensorFlow/PyTorch)", "Model Deployment (FastAPI, Docker)"],
        courses: ["Machine Learning Specialization by Andrew Ng (Coursera)", "Deep Learning Specialization (DeepLearning.AI)", "Fast.ai Practical Deep Learning for Coders"],
        roadmap: "Strengthen Python & Stats -> Learn Data Wrangling & Classic ML -> Master Deep Learning -> Dive into NLP or Computer Vision -> Build and Deploy ML models as Web Services."
    },
    cloud: {
        title: "Cloud Solutions Architect",
        skills: ["Linux System Administration", "Networking Basics (TCP/IP, DNS)", "AWS, Azure, or GCP Core Services", "Infrastructure as Code (Terraform)", "Docker & Kubernetes"],
        courses: ["AWS Certified Solutions Architect (ACloudGuru)", "Google Associate Cloud Engineer Cert (Coursera)", "Docker & Kubernetes Masterclass"],
        roadmap: "Understand Virtualization & Linux -> Master AWS/Azure core resources -> Learn Docker for Containerization -> Adopt Kubernetes for Orchestration -> Master Terraform for IaC."
    },
    cybersec: {
        title: "Cybersecurity Analyst",
        skills: ["Network Security Protocols", "Ethical Hacking & Penetration Testing", "Security Information & Event Management (SIEM)", "Linux & Scripting (Python/Bash)", "OWASP Top 10 vulnerabilities"],
        courses: ["Google Cybersecurity Professional Cert (Coursera)", "CompTIA Security+ Exam Prep", "The Complete Ethical Hacking Course (Udemy)"],
        roadmap: "Study Networking & OS -> Obtain CompTIA Security+ -> Learn Ethical Hacking (Kali Linux) -> Master Log Analysis and SIEM tools -> Participate in CTFs (Capture The Flag)."
    }
};

const DEPARTMENTS_DETAILS = {
    cs: {
        name: "Computer Science & BCA",
        icon: "bi bi-pc-display text-primary bg-primary bg-opacity-10",
        programs: ["B.Sc Computer Science (3 Years)", "BCA - Bachelor of Computer Applications (3 Years)", "M.Sc Computer Science (2 Years)"],
        studentsCount: 180,
        sections: 6,
        tuitionFee: "₹45,000",
        labFee: "₹10,000",
        examFee: "₹5,000",
        totalFee: "₹60,000",
        facilities: "Equipped with two advanced programming labs housing 120 high-speed computers, dedicated high-speed server racks, and AI project sandbox environments."
    },
    english: {
        name: "English Literature",
        icon: "bi bi-journal-text text-purple bg-purple bg-opacity-10",
        programs: ["B.A. English Literature (3 Years)", "M.A. English Literature (2 Years)"],
        studentsCount: 90,
        sections: 3,
        tuitionFee: "₹35,000",
        labFee: "₹4,000",
        examFee: "₹4,000",
        totalFee: "₹43,000",
        facilities: "Modern Language Communication Lab, a rich department reference library featuring over 5,000 classical and contemporary works, and writing workshop theater."
    },
    physics: {
        name: "Physics",
        icon: "bi bi-radioactive text-info bg-info bg-opacity-10",
        programs: ["B.Sc Physics (3 Years)", "M.Sc Physics (2 Years)"],
        studentsCount: 120,
        sections: 4,
        tuitionFee: "₹42,000",
        labFee: "₹8,000",
        examFee: "₹5,000",
        totalFee: "₹55,000",
        facilities: "State-of-the-art optics laboratory, darkroom facilities, electronics workbenches, and computational modeling systems for quantum astrophysics research."
    },
    chemistry: {
        name: "Chemistry",
        icon: "bi bi-droplet-fill text-success bg-success bg-opacity-10",
        programs: ["B.Sc Chemistry (3 Years)", "M.Sc Analytical Chemistry (2 Years)"],
        studentsCount: 110,
        sections: 4,
        tuitionFee: "₹42,000",
        labFee: "₹10,000",
        examFee: "₹5,000",
        totalFee: "₹57,000",
        facilities: "Advanced organic synthesis laboratory, fully ventilated fume hoods, spectrophotometers, and analytical chromatography instruments."
    },
    math: {
        name: "Mathematics",
        icon: "bi bi-calculator-fill text-warning bg-warning bg-opacity-10",
        programs: ["B.Sc Mathematics (3 Years)", "M.Sc Mathematics (2 Years)"],
        studentsCount: 95,
        sections: 3,
        tuitionFee: "₹38,000",
        labFee: "₹5,000",
        examFee: "₹4,500",
        totalFee: "₹47,500",
        facilities: "Mathematical modeling lab equipped with MATLAB and Mathematica licenses, statistical analysis workshop systems, and competitive math prep resources."
    },
    commerce: {
        name: "Commerce & BBA",
        icon: "bi bi-cash-coin text-danger bg-danger bg-opacity-10",
        programs: ["B.Com - General (3 Years)", "B.Com - Computer Applications (3 Years)", "BBA - Bachelor of Business Administration (3 Years)", "M.Com (2 Years)"],
        studentsCount: 240,
        sections: 8,
        tuitionFee: "₹45,000",
        labFee: "₹6,000",
        examFee: "₹5,000",
        totalFee: "₹56,000",
        facilities: "Virtual business boardrooms, mock trading floor software interfaces, digital banking simulation labs, and entrepreneurship incubator cells."
    },
    biotech: {
        name: "Biotechnology & Microbiology",
        icon: "bi bi-dna text-success bg-success bg-opacity-10",
        programs: ["B.Sc Biotechnology (3 Years)", "B.Sc Microbiology (3 Years)", "M.Sc Biotechnology (2 Years)"],
        studentsCount: 130,
        sections: 4,
        tuitionFee: "₹48,000",
        labFee: "₹12,000",
        examFee: "₹5,000",
        totalFee: "₹65,000",
        facilities: "Equipped with high-end bio-safety cabinets, compound microscopes, PCR chambers, autoclaves, and fermentation incubator setups."
    },
    economics: {
        name: "Economics & Political Science",
        icon: "bi bi-graph-up-arrow text-info bg-info bg-opacity-10",
        programs: ["B.A. Economics (3 Years)", "B.A. Political Science (3 Years)", "M.A. Applied Economics (2 Years)"],
        studentsCount: 110,
        sections: 4,
        tuitionFee: "₹36,000",
        labFee: "₹3,000",
        examFee: "₹4,000",
        totalFee: "₹43,000",
        facilities: "Economic forecasting data systems, public policy research archives, and active debating society rooms for governmental mock models."
    },
    viscom: {
        name: "Visual Communication & Media",
        icon: "bi bi-camera-reels text-warning bg-warning bg-opacity-10",
        programs: ["B.Sc Visual Communication (3 Years)", "M.Sc Electronic Media (2 Years)"],
        studentsCount: 140,
        sections: 5,
        tuitionFee: "₹55,000",
        labFee: "₹15,000",
        examFee: "₹5,000",
        totalFee: "₹75,000",
        facilities: "A professional soundproof recording studio, television editing bays, photo studio equipped with green screens, and premium cameras."
    }
};

// Initialize DB in LocalStorage
function initDB() {
    // Check version to auto-clear legacy engineering local storage structures
    const DB_VERSION = "2.2";
    if (localStorage.getItem("campusai_db_version") !== DB_VERSION) {
        localStorage.removeItem("campusai_students");
        localStorage.removeItem("campusai_users");
        localStorage.removeItem("campusai_notices");
        localStorage.removeItem("campusai_events");
        localStorage.removeItem("campusai_chat_history");
        localStorage.setItem("campusai_db_version", DB_VERSION);
    }

    if (!localStorage.getItem("campusai_students")) {
        localStorage.setItem("campusai_students", JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem("campusai_users")) {
        localStorage.setItem("campusai_users", JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem("campusai_notices")) {
        localStorage.setItem("campusai_notices", JSON.stringify(DEFAULT_NOTICES));
    }
    if (!localStorage.getItem("campusai_events")) {
        localStorage.setItem("campusai_events", JSON.stringify(DEFAULT_EVENTS));
    }
    if (!localStorage.getItem("campusai_chat_history")) {
        localStorage.setItem("campusai_chat_history", JSON.stringify([]));
    }
}

// Invoke initialization
initDB();

const MockDB = {
    // Student Methods
    getStudents: () => JSON.parse(localStorage.getItem("campusai_students")),
    getStudentById: (id) => MockDB.getStudents().find(s => s.id === id),
    saveStudent: (student) => {
        const students = MockDB.getStudents();
        const index = students.findIndex(s => s.id === student.id);
        if (index > -1) {
            students[index] = student;
        } else {
            students.push(student);
        }
        localStorage.setItem("campusai_students", JSON.stringify(students));
        return student;
    },
    deleteStudent: (id) => {
        let students = MockDB.getStudents();
        students = students.filter(s => s.id !== id);
        localStorage.setItem("campusai_students", JSON.stringify(students));
        
        let users = MockDB.getUsers();
        users = users.filter(u => u.refId !== id);
        localStorage.setItem("campusai_users", JSON.stringify(users));
        return true;
    },

    // User Methods
    getUsers: () => JSON.parse(localStorage.getItem("campusai_users")),
    authenticate: (username, password) => {
        const users = MockDB.getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (user) {
            return {
                success: true,
                username: user.username,
                role: user.role,
                refId: user.refId,
                name: user.name || (user.role === 'ROLE_STUDENT' ? MockDB.getStudentById(user.refId).name : "Admin User")
            };
        }
        return { success: false, message: "Invalid username or password" };
    },
    saveUser: (user) => {
        const users = MockDB.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index > -1) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem("campusai_users", JSON.stringify(users));
        return user;
    },

    // Notices Methods
    getNotices: () => JSON.parse(localStorage.getItem("campusai_notices")),
    saveNotice: (notice) => {
        const notices = MockDB.getNotices();
        notices.unshift(notice); // Prepend new notice
        localStorage.setItem("campusai_notices", JSON.stringify(notices));
        return notice;
    },

    // Events Methods
    getEvents: () => JSON.parse(localStorage.getItem("campusai_events")),
    saveEvent: (event) => {
        const events = MockDB.getEvents();
        events.push(event);
        localStorage.setItem("campusai_events", JSON.stringify(events));
        return event;
    },

    // Chat History Methods
    getChatHistory: (studentId) => {
        const allHistory = JSON.parse(localStorage.getItem("campusai_chat_history")) || [];
        if (!studentId) return allHistory;
        return allHistory.filter(c => c.studentId === studentId);
    },
    saveChatMsg: (msg) => {
        const allHistory = JSON.parse(localStorage.getItem("campusai_chat_history")) || [];
        msg.id = "MSG" + Date.now();
        msg.timestamp = new Date().toISOString();
        allHistory.push(msg);
        localStorage.setItem("campusai_chat_history", JSON.stringify(allHistory));
        return msg;
    },
    getChatbotAnalytics: () => {
        const history = MockDB.getChatHistory();
        const stats = {
            totalChats: history.length,
            topics: {
                timings: 0, departments: 0, courses: 0, admission: 0,
                fees: 0, exams: 0, placements: 0, hostel: 0, library: 0, faculty: 0, other: 0
            },
            timeline: {}
        };

        history.forEach(chat => {
            // Check categories
            let matched = false;
            for (const topic in stats.topics) {
                if (chat.question.toLowerCase().includes(topic)) {
                    stats.topics[topic]++;
                    matched = true;
                }
            }
            if (!matched) stats.topics.other++;

            // Timeline
            const dateStr = chat.timestamp.substring(0, 10);
            stats.timeline[dateStr] = (stats.timeline[dateStr] || 0) + 1;
        });

        return stats;
    },

    // NLP Query Router
    processQuery: (query) => {
        const q = query.toLowerCase();
        let answer = "";
        let topicKey = "";

        if (q.includes("timing") || q.includes("hours") || q.includes("schedule") || q.includes("time")) {
            answer = CHAT_ANSWERS.timings;
            topicKey = "timings";
        } else if (q.includes("department") || q.includes("branch") || q.includes("stream")) {
            answer = CHAT_ANSWERS.departments;
            topicKey = "departments";
        } else if (q.includes("course") || q.includes("program") || q.includes("degree") || q.includes("offer")) {
            answer = CHAT_ANSWERS.courses;
            topicKey = "courses";
        } else if (q.includes("admission") || q.includes("apply") || q.includes("join") || q.includes("tnea") || q.includes("counselling")) {
            answer = CHAT_ANSWERS.admission;
            topicKey = "admission";
        } else if (q.includes("fee") || q.includes("cost") || q.includes("payment") || q.includes("expense")) {
            answer = CHAT_ANSWERS.fees;
            topicKey = "fees";
        } else if (q.includes("exam") || q.includes("internal") || q.includes("test") || q.includes("assess") || q.includes("timetable")) {
            answer = CHAT_ANSWERS.exams;
            topicKey = "exams";
        } else if (q.includes("placement") || q.includes("recruit") || q.includes("job") || q.includes("salary") || q.includes("package") || q.includes("company") || q.includes("companies")) {
            answer = CHAT_ANSWERS.placements;
            topicKey = "placements";
        } else if (q.includes("hostel") || q.includes("mess") || q.includes("room") || q.includes("boarding")) {
            answer = CHAT_ANSWERS.hostel;
            topicKey = "hostel";
        } else if (q.includes("library") || q.includes("book") || q.includes("journal")) {
            answer = CHAT_ANSWERS.library;
            topicKey = "library";
        } else if (q.includes("faculty") || q.includes("teacher") || q.includes("professor") || q.includes("staff")) {
            answer = CHAT_ANSWERS.faculty;
            topicKey = "faculty";
        } else {
            // General query fallback response
            answer = "I'm sorry, I couldn't find a direct answer. CampusAI can help you with: <b>College timings, Departments, Courses available, Admission process, Fee details, Exam dates, Placement details, Hostel facilities, Library timings, and Faculty profiles</b>. Please try rephrasing your question!";
            topicKey = "other";
        }

        return { answer, topic: topicKey };
    },

    // Career Guide Suggestions
    getCareerPaths: () => CAREER_GUIDE,
    getCareerPath: (key) => CAREER_GUIDE[key],
    
    // Department Details Methods
    getDepartmentDetails: (key) => DEPARTMENTS_DETAILS[key]
};

// Export to window object for frontend scripts
window.MockDB = MockDB;
