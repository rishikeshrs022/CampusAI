/**
 * CampusAI - Mock Database and Knowledge Base
 * Seeds initial data into localStorage and provides helper methods to access and modify data.
 */

const DEFAULT_STUDENTS = [
    {
        id: "STU2025001",
        name: "Rishikesh R",
        email: "rishikesh@gmail.com",
        password: "password123", 
        department: "B.Sc Information Technology (B.Sc IT)",
        year: 2,
        phone: "+91 98765 43210",
        attendance: 86.5,
        attendanceDetails: [
            { subject: "Networking Basics", attended: 36, total: 40, percent: 90.0 },
            { subject: "Web Technologies", attended: 32, total: 40, percent: 80.0 },
            { subject: "Python Programming", attended: 35, total: 40, percent: 87.5 }
        ],
        cgpa: 8.75,
        semesterDetails: [
            { sem: 1, gpa: 8.5 },
            { sem: 2, gpa: 8.75 }
        ],
        marks: [
            { subject: "Networking Basics", test1: 85, test2: 90, model: 88 },
            { subject: "Web Technologies", test1: 78, test2: 82, model: 80 }
        ]
    },
    {
        id: "STU2025002",
        name: "Sneha P",
        email: "sneha@gmail.com",
        password: "password123",
        department: "BCA – Bachelor of Computer Applications",
        year: 2,
        phone: "+91 98765 43211",
        attendance: 92.0,
        attendanceDetails: [
            { subject: "Database Management", attended: 38, total: 40, percent: 95.0 },
            { subject: "Java Programming", attended: 36, total: 40, percent: 90.0 }
        ],
        cgpa: 9.15,
        semesterDetails: [
            { sem: 1, gpa: 9.0 },
            { sem: 2, gpa: 9.15 }
        ],
        marks: [
            { subject: "Database Management", test1: 95, test2: 94, model: 96 }
        ]
    },
    {
        id: "STU2025003",
        name: "Karthik S",
        email: "karthik@gmail.com",
        password: "password123",
        department: "B.Com Computer Applications (B.Com CA)",
        year: 1,
        phone: "+91 98765 43212",
        attendance: 74.5,
        attendanceDetails: [
            { subject: "Financial Accounting", attended: 28, total: 40, percent: 70.0 },
            { subject: "Office Automation", attended: 30, total: 40, percent: 75.0 }
        ],
        cgpa: 7.20,
        semesterDetails: [
            { sem: 1, gpa: 7.20 }
        ],
        marks: [
            { subject: "Financial Accounting", test1: 65, test2: 70, model: 68 }
        ]
    },
    {
        id: "STU2025004",
        name: "Priya M",
        email: "priya@gmail.com",
        password: "password123",
        department: "B.Sc Computer Science (B.Sc CS)",
        year: 2,
        phone: "+91 98765 43213",
        attendance: 82.0,
        attendanceDetails: [
            { subject: "Operating Systems", attended: 33, total: 40, percent: 82.5 }
        ],
        cgpa: 8.50,
        semesterDetails: [
            { sem: 1, gpa: 8.40 },
            { sem: 2, gpa: 8.50 }
        ],
        marks: [
            { subject: "Operating Systems", test1: 82, test2: 84, model: 83 }
        ]
    },
    {
        id: "STU2025005",
        name: "Arun V",
        email: "arun@gmail.com",
        password: "password123",
        department: "BBA – Bachelor of Business Administration",
        year: 1,
        phone: "+91 98765 43214",
        attendance: 80.0,
        attendanceDetails: [
            { subject: "Principles of Management", attended: 32, total: 40, percent: 80.0 }
        ],
        cgpa: 7.80,
        semesterDetails: [
            { sem: 1, gpa: 7.80 }
        ],
        marks: [
            { subject: "Principles of Management", test1: 75, test2: 80, model: 78 }
        ]
    }
];

const DEFAULT_USERS = [
    { id: "U001", username: "STU2025001", password: "password123", role: "ROLE_STUDENT", refId: "STU2025001" },
    { id: "U002", username: "STU2025002", password: "password123", role: "ROLE_STUDENT", refId: "STU2025002" },
    { id: "U003", username: "STU2025003", password: "password123", role: "ROLE_STUDENT", refId: "STU2025003" },
    { id: "U004", username: "STU2025004", password: "password123", role: "ROLE_STUDENT", refId: "STU2025004" },
    { id: "U005", username: "STU2025005", password: "password123", role: "ROLE_STUDENT", refId: "STU2025005" },
    { id: "U006", username: "admin", password: "admin123", role: "ROLE_ADMIN", name: "Rishi", email: "admin@campusai.edu" }
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
    it: {
        name: "B.Sc Information Technology (B.Sc IT)",
        icon: "bi bi-laptop text-primary bg-primary bg-opacity-10",
        programs: ["B.Sc Information Technology (3 Years)", "M.Sc Information Technology (2 Years)"],
        studentsCount: 120,
        sections: 4,
        tuitionFee: "₹45,000",
        labFee: "₹10,000",
        examFee: "₹5,000",
        totalFee: "₹60,000",
        facilities: "Equipped with state-of-the-art networking labs, IoT development kits, Cloud computing access, and software engineering suites."
    },
    cs: {
        name: "B.Sc Computer Science (B.Sc CS)",
        icon: "bi bi-pc-display text-primary bg-primary bg-opacity-10",
        programs: ["B.Sc Computer Science (3 Years)", "M.Sc Computer Science (2 Years)"],
        studentsCount: 180,
        sections: 6,
        tuitionFee: "₹45,000",
        labFee: "₹10,000",
        examFee: "₹5,000",
        totalFee: "₹60,000",
        facilities: "Advanced programming labs, GPU computing servers for deep learning, virtualization clusters, and reference computing library."
    },
    bca: {
        name: "BCA – Bachelor of Computer Applications",
        icon: "bi bi-window text-info bg-info bg-opacity-10",
        programs: ["BCA (3 Years)", "MCA (2 Years)"],
        studentsCount: 150,
        sections: 5,
        tuitionFee: "₹43,000",
        labFee: "₹8,000",
        examFee: "₹5,000",
        totalFee: "₹56,000",
        facilities: "Application development center, mobile programming labs, digital design suites, and database management workshops."
    },
    aiml: {
        name: "B.Sc Artificial Intelligence & Machine Learning (AI & ML)",
        icon: "bi bi-cpu text-purple bg-purple bg-opacity-10",
        programs: ["B.Sc AI & ML (3 Years)", "M.Sc Artificial Intelligence (2 Years)"],
        studentsCount: 90,
        sections: 3,
        tuitionFee: "₹55,000",
        labFee: "₹15,000",
        examFee: "₹6,000",
        totalFee: "₹76,000",
        facilities: "NVIDIA DGX-powered research lab, neural network modeling suites, robotics kits, and computer vision sandbox setups."
    },
    datascience: {
        name: "B.Sc Data Science",
        icon: "bi bi-database text-warning bg-warning bg-opacity-10",
        programs: ["B.Sc Data Science (3 Years)", "M.Sc Big Data Analytics (2 Years)"],
        studentsCount: 100,
        sections: 3,
        tuitionFee: "₹50,000",
        labFee: "₹12,000",
        examFee: "₹5,000",
        totalFee: "₹67,000",
        facilities: "Big Data processing setups, Hadoop and Spark virtual environments, visualization labs, and statistical analysis computers."
    },
    bcom: {
        name: "B.Com – Bachelor of Commerce",
        icon: "bi bi-bank text-success bg-success bg-opacity-10",
        programs: ["B.Com General (3 Years)", "M.Com (2 Years)"],
        studentsCount: 200,
        sections: 6,
        tuitionFee: "₹38,000",
        labFee: "₹4,000",
        examFee: "₹4,500",
        totalFee: "₹46,500",
        facilities: "Financial simulation center, accounting software lab with Tally licenses, and business communication reference libraries."
    },
    bcomca: {
        name: "B.Com Computer Applications (B.Com CA)",
        icon: "bi bi-file-earmark-spreadsheet text-success bg-success bg-opacity-10",
        programs: ["B.Com Computer Applications (3 Years)"],
        studentsCount: 160,
        sections: 5,
        tuitionFee: "₹42,000",
        labFee: "₹7,000",
        examFee: "₹5,000",
        totalFee: "₹54,000",
        facilities: "E-Commerce computing labs, financial spreadsheets workshops, and computerized accounting systems setups."
    },
    bba: {
        name: "BBA – Bachelor of Business Administration",
        icon: "bi bi-briefcase text-danger bg-danger bg-opacity-10",
        programs: ["BBA General (3 Years)", "MBA (2 Years)"],
        studentsCount: 150,
        sections: 5,
        tuitionFee: "₹45,000",
        labFee: "₹5,000",
        examFee: "₹5,000",
        totalFee: "₹55,000",
        facilities: "Virtual boardrooms, corporate discussion theater, management simulation models, and entrepreneurship cell."
    },
    bbaca: {
        name: "BBA Computer Applications",
        icon: "bi bi-display text-danger bg-danger bg-opacity-10",
        programs: ["BBA Computer Applications (3 Years)"],
        studentsCount: 110,
        sections: 4,
        tuitionFee: "₹46,000",
        labFee: "₹8,000",
        examFee: "₹5,000",
        totalFee: "₹59,000",
        facilities: "Business management information systems (MIS) labs, ERP software interfaces, and digital presentation suites."
    },
    maths: {
        name: "B.Sc Mathematics",
        icon: "bi bi-calculator text-warning bg-warning bg-opacity-10",
        programs: ["B.Sc Mathematics (3 Years)", "M.Sc Mathematics (2 Years)"],
        studentsCount: 95,
        sections: 3,
        tuitionFee: "₹36,000",
        labFee: "₹4,000",
        examFee: "₹4,000",
        totalFee: "₹44,000",
        facilities: "Mathematical modeling lab featuring MATLAB and LaTeX licenses, reference seminar hall, and statistical toolkits."
    },
    physics: {
        name: "B.Sc Physics",
        icon: "bi bi-radioactive text-info bg-info bg-opacity-10",
        programs: ["B.Sc Physics (3 Years)", "M.Sc Physics (2 Years)"],
        studentsCount: 120,
        sections: 4,
        tuitionFee: "₹40,000",
        labFee: "₹8,000",
        examFee: "₹5,000",
        totalFee: "₹53,000",
        facilities: "Modern optics darkroom, electronic circuit benches, thermodynamics lab, and computational physics systems."
    },
    chemistry: {
        name: "B.Sc Chemistry",
        icon: "bi bi-droplet text-success bg-success bg-opacity-10",
        programs: ["B.Sc Chemistry (3 Years)", "M.Sc Analytical Chemistry (2 Years)"],
        studentsCount: 110,
        sections: 4,
        tuitionFee: "₹40,000",
        labFee: "₹9,000",
        examFee: "₹5,000",
        totalFee: "₹54,000",
        facilities: "Organic synthesis laboratory, ventilated fume hoods, digital spectrophotometers, and inorganic analysis workshops."
    },
    english: {
        name: "B.A English",
        icon: "bi bi-journal-text text-purple bg-purple bg-opacity-10",
        programs: ["B.A English Literature (3 Years)", "M.A English Literature (2 Years)"],
        studentsCount: 90,
        sections: 3,
        tuitionFee: "₹32,000",
        labFee: "₹3,000",
        examFee: "₹4,000",
        totalFee: "₹39,000",
        facilities: "Language communication theater, digital phonetics lab, and library reference wing with over 5,000 literary works."
    },
    tamil: {
        name: "B.A Tamil",
        icon: "bi bi-translate text-pink bg-pink bg-opacity-10",
        programs: ["B.A Tamil Literature (3 Years)", "M.A Tamil (2 Years)"],
        studentsCount: 80,
        sections: 3,
        tuitionFee: "₹30,000",
        labFee: "₹2,000",
        examFee: "₹4,000",
        totalFee: "₹36,000",
        facilities: "Tamil classical literature reference department, poetry workshop forum, and historical manuscript study archives."
    },
    economics: {
        name: "B.A Economics",
        icon: "bi bi-graph-up-arrow text-info bg-info bg-opacity-10",
        programs: ["B.A Economics (3 Years)", "M.A Econometrics (2 Years)"],
        studentsCount: 100,
        sections: 3,
        tuitionFee: "₹34,000",
        labFee: "₹3,000",
        examFee: "₹4,000",
        totalFee: "₹41,000",
        facilities: "Macroeconomics statistics forecasting center, data tracking terminals, and active public debating chambers."
    }
};

const DEFAULT_FACULTY = [
    { id: "FAC001", name: "Dr. K. Raghavan", designation: "Professor & Head", department: "B.Sc Computer Science (B.Sc CS)", email: "raghavan@campusai.edu" },
    { id: "FAC002", name: "Dr. Ananya Sen", designation: "Associate Professor", department: "B.Sc Information Technology (B.Sc IT)", email: "ananya.sen@campusai.edu" },
    { id: "FAC003", name: "Prof. S. Ranganathan", designation: "Assistant Professor", department: "B.Sc Mathematics", email: "ranganathan@campusai.edu" },
    { id: "FAC004", name: "Dr. Meera Bai", designation: "Professor & Head", department: "B.A English", email: "meera.bai@campusai.edu" },
    { id: "FAC005", name: "Dr. G. Vasudevan", designation: "Professor", department: "B.Sc Physics", email: "vasudevan@campusai.edu" }
];

const DEFAULT_COURSES = [
    { code: "CS201", name: "Database Management Systems", department: "B.Sc Computer Science (B.Sc CS)", duration: "1 Semester", credits: 4 },
    { code: "IT202", name: "Web Programming with JS", department: "B.Sc Information Technology (B.Sc IT)", duration: "1 Semester", credits: 4 },
    { code: "AI301", name: "Neural Networks & Deep Learning", department: "B.Sc Artificial Intelligence & Machine Learning (AI & ML)", duration: "1 Semester", credits: 5 },
    { code: "DS102", name: "Statistical Data Analysis", department: "B.Sc Data Science", duration: "1 Semester", credits: 4 },
    { code: "CO101", name: "Principles of Accounting", department: "B.Com – Bachelor of Commerce", duration: "1 Semester", credits: 3 }
];

const DEFAULT_LIBRARY = [
    { id: "BK001", title: "Introduction to Algorithms", author: "Cormen, Leiserson", department: "B.Sc Computer Science (B.Sc CS)", status: "Available" },
    { id: "BK002", title: "Quantum Physics", author: "H.C. Verma", department: "B.Sc Physics", status: "Issued" },
    { id: "BK003", title: "Organic Chemistry Vol 1", author: "Morrison & Boyd", department: "B.Sc Chemistry", status: "Available" },
    { id: "BK004", title: "Advanced Calculus", author: "Spivak", department: "B.Sc Mathematics", status: "Issued" }
];

// Initialize DB in LocalStorage
function initDB() {
    // Check version to auto-clear legacy engineering local storage structures
    const DB_VERSION = "3.0";
    if (localStorage.getItem("campusai_db_version") !== DB_VERSION) {
        localStorage.removeItem("campusai_students");
        localStorage.removeItem("campusai_users");
        localStorage.removeItem("campusai_notices");
        localStorage.removeItem("campusai_events");
        localStorage.removeItem("campusai_chat_history");
        localStorage.removeItem("campusai_departments");
        localStorage.removeItem("campusai_faculty");
        localStorage.removeItem("campusai_courses");
        localStorage.removeItem("campusai_library");
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
    if (!localStorage.getItem("campusai_departments")) {
        localStorage.setItem("campusai_departments", JSON.stringify(DEPARTMENTS_DETAILS));
    }
    if (!localStorage.getItem("campusai_faculty")) {
        localStorage.setItem("campusai_faculty", JSON.stringify(DEFAULT_FACULTY));
    }
    if (!localStorage.getItem("campusai_courses")) {
        localStorage.setItem("campusai_courses", JSON.stringify(DEFAULT_COURSES));
    }
    if (!localStorage.getItem("campusai_library")) {
        localStorage.setItem("campusai_library", JSON.stringify(DEFAULT_LIBRARY));
    }
}

// Invoke initialization
initDB();

const API_BASE = window.location.origin + "/api";
let useBackend = false;

// Auto-detect backend presence using a lightweight synchronous ping
try {
    const pingXhr = new XMLHttpRequest();
    pingXhr.open("GET", API_BASE + "/departments", false);
    pingXhr.send();
    if (pingXhr.status === 200 || pingXhr.status === 401 || pingXhr.status === 403) {
        useBackend = true;
        console.log("CampusAI: Successfully connected to Spring Boot Backend API.");
    }
} catch (e) {
    console.log("CampusAI: Running in Standalone (Local Storage Mock Mode).");
}

function apiRequest(method, url, body = null) {
    if (!useBackend) return null;
    try {
        const xhr = new XMLHttpRequest();
        xhr.open(method, API_BASE + url, false); // Synchronous API requests
        xhr.setRequestHeader("Content-Type", "application/json");

        // Basic authentication: read user session details
        const storedUser = JSON.parse(localStorage.getItem("campusai_current_user") || "{}");
        let username = "";
        let password = "";
        if (storedUser && storedUser.username) {
            username = storedUser.username;
            password = localStorage.getItem("campusai_saved_password") || "Student@123";
        } else {
            username = localStorage.getItem("campusai_saved_username");
            password = localStorage.getItem("campusai_saved_password");
        }

        // Login endpoint parameter injection
        if (url === "/login" && body) {
            username = body.username;
            password = body.password;
        }

        if (username && password) {
            const authHeader = "Basic " + btoa(username + ":" + password);
            xhr.setRequestHeader("Authorization", authHeader);
        }

        if (body) {
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }

        if (xhr.status >= 200 && xhr.status < 300) {
            return JSON.parse(xhr.responseText || "{}");
        } else {
            console.error("API Request failed:", method, url, xhr.status, xhr.responseText);
            if (url === "/login" && xhr.status === 401) {
                return { success: false, message: "Invalid username or password." };
            }
            return null;
        }
    } catch (e) {
        console.error("API network request error:", e);
        return null;
    }
}

const MockDB = {
    // Student Methods
    getStudents: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/students");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_students"));
    },
    getStudentById: (id) => {
        if (useBackend) {
            return apiRequest("GET", "/students/" + id);
        }
        return MockDB.getStudents().find(s => s.id === id);
    },
    saveStudent: (student) => {
        if (useBackend) {
            return apiRequest("POST", "/students", student);
        }
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
    updateStudent: (id, updatedFields) => {
        if (useBackend) {
            return apiRequest("PUT", "/students/" + id, updatedFields);
        }
        const students = MockDB.getStudents();
        const index = students.findIndex(s => s.id === id);
        if (index > -1) {
            students[index] = { ...students[index], ...updatedFields };
            localStorage.setItem("campusai_students", JSON.stringify(students));
            
            if (updatedFields.email) {
                const users = MockDB.getUsers();
                const uIndex = users.findIndex(u => u.refId === id);
                if (uIndex > -1) {
                    users[uIndex].username = updatedFields.email;
                    localStorage.setItem("campusai_users", JSON.stringify(users));
                }
            }
            return { success: true, student: students[index] };
        }
        return { success: false, message: "Student not found in mock database." };
    },
    deleteStudent: (id) => {
        if (useBackend) {
            apiRequest("DELETE", "/students/" + id);
            return true;
        }
        let students = MockDB.getStudents();
        students = students.filter(s => s.id !== id);
        localStorage.setItem("campusai_students", JSON.stringify(students));
        
        let users = MockDB.getUsers();
        users = users.filter(u => u.refId !== id);
        localStorage.setItem("campusai_users", JSON.stringify(users));
        return true;
    },

    // User Methods
    getUsers: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/users");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_users"));
    },
    authenticate: (username, password) => {
        if (useBackend) {
            const res = apiRequest("POST", "/login", { username, password });
            if (res && res.success) {
                return {
                    success: true,
                    username: res.username,
                    role: res.role,
                    refId: res.refId,
                    name: res.name || (res.role === 'ROLE_STUDENT' ? MockDB.getStudentById(res.refId).name : "Admin User")
                };
            }
            return { success: false, message: res ? res.message : "Authentication failed." };
        }
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
        if (useBackend) {
            return apiRequest("POST", "/users", user);
        }
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
    googleLogin: (name, email, uid) => {
        if (useBackend) {
            const res = apiRequest("POST", "/google-login", { name, email, uid });
            if (res && res.success) {
                return {
                    success: true,
                    username: res.username,
                    role: res.role,
                    refId: res.refId,
                    name: res.name
                };
            }
            return { success: false, message: res ? res.message : "Google authentication sync failed." };
        }
        
        let students = MockDB.getStudents() || [];
        let student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
        let studentId = "";
        
        if (!student) {
            studentId = `STU_G_${uid.substring(0, 8).toUpperCase()}`;
            student = {
                id: studentId,
                name: name || "Google Student",
                email: email,
                password: "GOOGLE_AUTH",
                department: "B.Sc Data Science",
                academicYear: 1,
                phone: "N/A",
                attendance: 100,
                cgpa: 4.0
            };
            students.push(student);
            localStorage.setItem("campusai_students", JSON.stringify(students));
            
            let users = MockDB.getUsers() || [];
            users.push({
                id: studentId,
                username: email,
                password: "GOOGLE_AUTH",
                role: "ROLE_STUDENT",
                refId: studentId,
                name: name
            });
            localStorage.setItem("campusai_users", JSON.stringify(users));
        } else {
            studentId = student.id;
        }
        
        const users = MockDB.getUsers() || [];
        const user = users.find(u => u.refId === studentId);
        
        return {
            success: true,
            username: user ? user.username : email,
            role: "ROLE_STUDENT",
            refId: studentId,
            name: name || student.name
        };
    },

    // Notices Methods
    getNotices: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/notices");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_notices"));
    },
    saveNotice: (notice) => {
        if (useBackend) {
            return apiRequest("POST", "/notices", notice);
        }
        const notices = MockDB.getNotices();
        notices.unshift(notice); // Prepend new notice
        localStorage.setItem("campusai_notices", JSON.stringify(notices));
        return notice;
    },

    // Events Methods
    getEvents: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/events");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_events"));
    },
    saveEvent: (event) => {
        if (useBackend) {
            return apiRequest("POST", "/events", event);
        }
        const events = MockDB.getEvents();
        events.push(event);
        localStorage.setItem("campusai_events", JSON.stringify(events));
        return event;
    },

    // Chat History Methods
    getChatHistory: (studentId) => {
        if (useBackend) {
            const list = studentId ? apiRequest("GET", "/chat/history/" + studentId) : apiRequest("GET", "/chat/history");
            return list || [];
        }
        const allHistory = JSON.parse(localStorage.getItem("campusai_chat_history")) || [];
        if (!studentId) return allHistory;
        return allHistory.filter(c => c.studentId === studentId);
    },
    saveChatMsg: (msg) => {
        if (useBackend) {
            return apiRequest("POST", "/chat", { studentId: msg.studentId, question: msg.question });
        }
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
            const dateStr = (chat.timestamp || "").substring(0, 10);
            if (dateStr) {
                stats.timeline[dateStr] = (stats.timeline[dateStr] || 0) + 1;
            }
        });

        return stats;
    },

    // NLP Query Router
    processQuery: (query, studentId = null) => {
        if (useBackend) {
            const res = apiRequest("POST", "/chat", { studentId, question: query });
            return res || { answer: "Error connecting to chatbot service.", topic: "other" };
        }
        const q = query.toLowerCase().strip ? query.toLowerCase().trim().replace(/[?!.]/g, "") : query.toLowerCase().trim();
        let answer = "";
        let topicKey = "";

        if (q === "hello" || q === "hi" || q === "hey" || q === "greetings" || q.startsWith("hello ") || q.startsWith("hi ") || q.startsWith("hey ") || q.startsWith("greetings ")) {
            answer = "Hello! How can I help you? I can assist you with details regarding: <b>College timings, Departments, Courses available, Admission process, Fee details, Exam dates, Placement details, Hostel facilities, Library timings, and Faculty profiles</b>.";
            topicKey = "greetings";
        } else if (q.includes("timing") || q.includes("hours") || q.includes("schedule") || q.includes("time")) {
            answer = CHAT_ANSWERS.timings;
            topicKey = "timings";
        } else if (q.includes("department") || q.includes("branch") || q.includes("stream")) {
            const depts = MockDB.getDepartments();
            const names = Object.keys(depts).map((key, i) => `${i + 1}. <b>${depts[key].name}</b>`).join("<br>");
            answer = `CampusAI features ${Object.keys(depts).length} premier Arts, Science, & Commerce departments:<br>${names}<br>All departments are NAAC A++ accredited.`;
            topicKey = "departments";
        } else if (q.includes("course") || q.includes("program") || q.includes("degree") || q.includes("offer")) {
            const courses = MockDB.getCourses();
            const names = courses.map(c => `• <b>${c.code}</b>: ${c.name} (${c.department})`).join("<br>");
            answer = `We offer the following academic course curriculums:<br>${names}`;
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
            const faculty = MockDB.getFaculty();
            const names = faculty.slice(0, 5).map(f => `• <b>${f.name}</b> - ${f.designation} (${f.department})`).join("<br>");
            answer = `We have over 86 experienced faculty members. Here are some of our professors:<br>${names}`;
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
    getDepartments: () => {
        if (useBackend) {
            const deptsList = apiRequest("GET", "/departments");
            if (deptsList) {
                const deptsMap = {};
                deptsList.forEach(d => {
                    deptsMap[d.deptKey] = d;
                });
                return deptsMap;
            }
        }
        return JSON.parse(localStorage.getItem("campusai_departments")) || {};
    },
    getDepartmentDetails: (key) => MockDB.getDepartments()[key],
    saveDepartment: (key, dept) => {
        if (useBackend) {
            return apiRequest("POST", "/departments", dept);
        }
        const depts = MockDB.getDepartments();
        depts[key] = dept;
        localStorage.setItem("campusai_departments", JSON.stringify(depts));
        return dept;
    },
    deleteDepartment: (key) => {
        if (useBackend) {
            apiRequest("DELETE", "/departments/" + key);
            return;
        }
        const depts = MockDB.getDepartments();
        delete depts[key];
        localStorage.setItem("campusai_departments", JSON.stringify(depts));
    },

    // Faculty Methods
    getFaculty: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/faculty");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_faculty")) || [];
    },
    saveFaculty: (faculty) => {
        if (useBackend) {
            return apiRequest("POST", "/faculty", faculty);
        }
        const list = MockDB.getFaculty();
        list.push(faculty);
        localStorage.setItem("campusai_faculty", JSON.stringify(list));
        return faculty;
    },
    deleteFaculty: (id) => {
        if (useBackend) {
            apiRequest("DELETE", "/faculty/" + id);
            return;
        }
        const list = MockDB.getFaculty().filter(f => f.id !== id);
        localStorage.setItem("campusai_faculty", JSON.stringify(list));
    },

    // Course Methods
    getCourses: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/courses");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_courses")) || [];
    },
    saveCourse: (course) => {
        if (useBackend) {
            return apiRequest("POST", "/courses", course);
        }
        const list = MockDB.getCourses();
        list.push(course);
        localStorage.setItem("campusai_courses", JSON.stringify(list));
        return course;
    },
    deleteCourse: (code) => {
        if (useBackend) {
            apiRequest("DELETE", "/courses/" + code);
            return;
        }
        const list = MockDB.getCourses().filter(c => c.code !== code);
        localStorage.setItem("campusai_courses", JSON.stringify(list));
    },

    // Library Methods
    getLibrary: () => {
        if (useBackend) {
            const list = apiRequest("GET", "/library/books");
            return list || [];
        }
        return JSON.parse(localStorage.getItem("campusai_library")) || [];
    },
    saveLibrary: (book) => {
        if (useBackend) {
            return apiRequest("POST", "/library/books", book);
        }
        const list = MockDB.getLibrary();
        list.push(book);
        localStorage.setItem("campusai_library", JSON.stringify(list));
        return book;
    },
    deleteLibrary: (id) => {
        if (useBackend) {
            apiRequest("DELETE", "/library/books/" + id);
            return;
        }
        const list = MockDB.getLibrary().filter(b => b.id !== id);
        localStorage.setItem("campusai_library", JSON.stringify(list));
    }
};

// Export to window object for frontend scripts
window.MockDB = MockDB;
