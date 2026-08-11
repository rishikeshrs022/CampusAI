-- ========================================================
-- CampusAI - MySQL Database Initial Seed Data
-- ========================================================


-- 1. Seed Departments Table
DELETE FROM departments;
INSERT INTO departments (dept_key, name, icon, programs, students_count, sections, tuition_fee, lab_fee, exam_fee, total_fee, facilities) VALUES 
('it', 'B.Sc Information Technology (B.Sc IT)', 'bi bi-laptop text-primary bg-primary bg-opacity-10', 'B.Sc Information Technology (3 Years), M.Sc Information Technology (2 Years)', 120, 4, '₹45,000', '₹10,000', '₹5,000', '₹60,000', 'Equipped with state-of-the-art networking labs, IoT development kits, Cloud computing access, and software engineering suites.'),
('cs', 'B.Sc Computer Science (B.Sc CS)', 'bi bi-pc-display text-primary bg-primary bg-opacity-10', 'B.Sc Computer Science (3 Years), M.Sc Computer Science (2 Years)', 180, 6, '₹45,000', '₹10,000', '₹5,000', '₹60,000', 'Advanced programming labs, GPU computing servers for deep learning, virtualization clusters, and reference computing library.'),
('bca', 'BCA – Bachelor of Computer Applications', 'bi bi-window text-info bg-info bg-opacity-10', 'BCA (3 Years), MCA (2 Years)', 150, 5, '₹43,000', '₹8,000', '₹5,000', '₹56,000', 'Application development center, mobile programming labs, digital design suites, and database management workshops.'),
('aiml', 'B.Sc Artificial Intelligence & Machine Learning (AI & ML)', 'bi bi-cpu text-purple bg-purple bg-opacity-10', 'B.Sc AI & ML (3 Years), M.Sc Artificial Intelligence (2 Years)', 90, 3, '₹55,000', '₹15,000', '₹6,000', '₹76,000', 'NVIDIA DGX-powered research lab, neural network modeling suites, robotics kits, and computer vision sandbox setups.'),
('datascience', 'B.Sc Data Science', 'bi bi-database text-warning bg-warning bg-opacity-10', 'B.Sc Data Science (3 Years), M.Sc Big Data Analytics (2 Years)', 100, 3, '₹50,000', '₹12,000', '₹5,000', '₹67,000', 'Big Data processing setups, Hadoop and Spark virtual environments, visualization labs, and statistical analysis computers.'),
('bcom', 'B.Com – Bachelor of Commerce', 'bi bi-bank text-success bg-success bg-opacity-10', 'B.Com General (3 Years), M.Com (2 Years)', 200, 6, '₹38,000', '₹4,000', '₹4,500', '₹46,500', 'Financial simulation center, accounting software lab with Tally licenses, and business communication reference libraries.'),
('bcomca', 'B.Com Computer Applications (B.Com CA)', 'bi bi-file-earmark-spreadsheet text-success bg-success bg-opacity-10', 'B.Com Computer Applications (3 Years)', 160, 5, '₹42,000', '₹7,000', '₹5,000', '₹54,000', 'E-Commerce computing labs, financial spreadsheets workshops, and computerized accounting systems setups.'),
('bba', 'BBA – Bachelor of Business Administration', 'bi bi-briefcase text-danger bg-danger bg-opacity-10', 'BBA General (3 Years), MBA (2 Years)', 150, 5, '₹45,000', '₹5,000', '₹5,000', '₹55,000', 'Virtual boardrooms, corporate discussion theater, management simulation models, and entrepreneurship cell.'),
('bbaca', 'BBA Computer Applications', 'bi bi-display text-danger bg-danger bg-opacity-10', 'BBA Computer Applications (3 Years)', 110, 4, '₹46,000', '₹8,000', '₹5,000', '₹59,000', 'Business management information systems (MIS) labs, ERP software interfaces, and digital presentation suites.'),
('maths', 'B.Sc Mathematics', 'bi bi-calculator text-warning bg-warning bg-opacity-10', 'B.Sc Mathematics (3 Years), M.Sc Mathematics (2 Years)', 95, 3, '₹36,000', '₹4,000', '₹4,000', '₹44,000', 'Mathematical modeling lab featuring MATLAB and LaTeX licenses, reference seminar hall, and statistical toolkits.'),
('physics', 'B.Sc Physics', 'bi bi-radioactive text-info bg-info bg-opacity-10', 'B.Sc Physics (3 Years), M.Sc Physics (2 Years)', 120, 4, '₹40,000', '₹8,000', '₹5,000', '₹53,000', 'Modern optics darkroom, electronic circuit benches, thermodynamics lab, and computational physics systems.'),
('chemistry', 'B.Sc Chemistry', 'bi bi-droplet text-success bg-success bg-opacity-10', 'B.Sc Chemistry (3 Years), M.Sc Analytical Chemistry (2 Years)', 110, 4, '₹40,000', '₹9,000', '₹5,000', '₹54,000', 'Organic synthesis laboratory, ventilated fume hoods, digital spectrophotometers, and inorganic analysis workshops.'),
('english', 'B.A English', 'bi bi-journal-text text-purple bg-purple bg-opacity-10', 'B.A English Literature (3 Years), M.A English Literature (2 Years)', 90, 3, '₹32,000', '₹3,000', '₹4,000', '₹39,000', 'Language communication theater, digital phonetics lab, and library reference wing with over 5,000 literary works.'),
('tamil', 'B.A Tamil', 'bi bi-translate text-pink bg-pink bg-opacity-10', 'B.A Tamil Literature (3 Years), M.A Tamil (2 Years)', 80, 3, '₹30,000', '₹2,000', '₹4,000', '₹36,000', 'Tamil classical literature reference department, poetry workshop forum, and historical manuscript study archives.'),
('economics', 'B.A Economics', 'bi bi-graph-up-arrow text-info bg-info bg-opacity-10', 'B.A Economics (3 Years), M.A Econometrics (2 Years)', 100, 3, '₹34,000', '₹3,000', '₹4,000', '₹41,000', 'Macroeconomics statistics forecasting center, data tracking terminals, and active public debating chambers.');

-- 2. Seed Students Table
-- Password for all students: Student@123 -> $2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2
DELETE FROM students;
INSERT INTO students (id, name, email, password, department, academic_year, phone, attendance, cgpa) VALUES 
('STU2025001', 'Rishikesh R S', 'rishikeshrs022@gmail.com', '$2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2', 'B.Sc Information Technology (B.Sc IT)', 2, '+91 98765 43210', 86.5, 8.75),
('STU2025002', 'Sneha P', 'sneha@gmail.com', '$2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2', 'BCA – Bachelor of Computer Applications', 2, '+91 98765 43211', 92.0, 9.15),
('STU2025003', 'Rahul Sharma', 'rahul.sharma@campusai.edu', '$2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2', 'B.Sc Computer Science (B.Sc CS)', 3, '+91 98765 43212', 74.5, 7.20);

-- 3. Seed Users Table
-- Admin login details: admin123@gmail.com / Admin@123 -> $2b$10$BOrJVT7TfLcpOje8v1N1juX2n167E7ymRw/xr6f1..RNlg5vg4Quq
-- User accounts mapped to Spring Security Authentication providers
DELETE FROM users;
INSERT INTO users (id, username, password, role, ref_id) VALUES 
('U001', 'STU2025001', '$2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2', 'ROLE_STUDENT', 'STU2025001'),
('U002', 'STU2025002', '$2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2', 'ROLE_STUDENT', 'STU2025002'),
('U003', 'STU2025003', '$2b$10$PhvFxocYf6/YZuVLmGWWIexdS9N7GfUzh3XLd.m.YgwkVJ2WL9UA2', 'ROLE_STUDENT', 'STU2025003'),
('U004', 'admin123@gmail.com', '$2b$10$BOrJVT7TfLcpOje8v1N1juX2n167E7ymRw/xr6f1..RNlg5vg4Quq', 'ROLE_ADMIN', NULL);

-- 4. Seed Faculty Table
DELETE FROM faculty;
INSERT INTO faculty (id, name, email, phone, department, designation, experience, status) VALUES 
('FAC001', 'Dr. K. Raghavan', 'raghavan@campusai.edu', '+91 98765 40001', 'B.Sc Computer Science (B.Sc CS)', 'Professor & Head', 15, 'Active'),
('FAC002', 'Dr. Ananya Sen', 'ananya.sen@campusai.edu', '+91 98765 40002', 'B.Sc Information Technology (B.Sc IT)', 'Associate Professor', 10, 'Active'),
('FAC003', 'Prof. S. Ranganathan', 'ranganathan@campusai.edu', '+91 98765 40003', 'B.Sc Mathematics', 'Assistant Professor', 8, 'Active'),
('FAC004', 'Dr. Meera Bai', 'meera.bai@campusai.edu', '+91 98765 40004', 'B.A English', 'Professor & Head', 18, 'Active'),
('FAC005', 'Dr. G. Vasudevan', 'vasudevan@campusai.edu', '+91 98765 40005', 'B.Sc Physics', 'Professor', 12, 'Active');

-- 5. Seed Courses Table
DELETE FROM courses;
INSERT INTO courses (code, name, department, semester, faculty, credits) VALUES 
('IT301', 'Web Technologies', 'B.Sc Information Technology (B.Sc IT)', 3, 'Dr. Ananya Sen', 4),
('CS301', 'Networking Basics', 'B.Sc Computer Science (B.Sc CS)', 3, 'Dr. K. Raghavan', 4),
('MA201', 'Discrete Mathematics', 'B.Sc Mathematics', 2, 'Prof. S. Ranganathan', 3),
('EN101', 'English Literature Basics', 'B.A English', 1, 'Dr. Meera Bai', 3);

-- 6. Seed Attendance Table
DELETE FROM attendance;
INSERT INTO attendance (date, department, academic_year, student_id, status) VALUES 
('2026-06-13', 'B.Sc Information Technology (B.Sc IT)', 2, 'STU2025001', 'Present'),
('2026-06-13', 'BCA – Bachelor of Computer Applications', 2, 'STU2025002', 'Present'),
('2026-06-13', 'B.Sc Computer Science (B.Sc CS)', 3, 'STU2025003', 'Absent');

-- 7. Seed Examinations Table
DELETE FROM examinations;
INSERT INTO examinations (exam_name, subject, department, semester, date, time, room, status) VALUES 
('Semester End Assessment', 'Web Technologies', 'B.Sc Information Technology (B.Sc IT)', 3, '2026-11-18', '10:00 AM', 'Exam Hall A', 'Upcoming'),
('Semester End Assessment', 'Networking Basics', 'B.Sc Computer Science (B.Sc CS)', 3, '2026-11-19', '10:00 AM', 'Exam Hall B', 'Upcoming'),
('Continuous Assessment I', 'Discrete Mathematics', 'B.Sc Mathematics', 2, '2026-08-20', '09:30 AM', 'Seminar Room 1', 'Completed');

-- 8. Seed Books Table
DELETE FROM books;
INSERT INTO books (id, title, author, isbn, category, quantity, available_quantity) VALUES 
('BK001', 'Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 'Computer Science', 10, 8),
('BK002', 'Computer Networking', 'James F. Kurose', '978-0133594140', 'Computer Science', 5, 4),
('BK003', 'Calculus', 'James Stewart', '978-1285740621', 'Mathematics', 8, 7),
('BK004', 'University Physics', 'Hugh D. Young', '978-0135159552', 'Physics', 6, 6);

-- 9. Seed Library Transactions Table
DELETE FROM library_transactions;
INSERT INTO library_transactions (book_id, student_id, student_name, issue_date, due_date, return_date, status) VALUES 
('BK001', 'STU2025001', 'Rishikesh R S', '2026-06-01', '2026-06-15', NULL, 'Issued'),
('BK002', 'STU2025001', 'Rishikesh R S', '2026-06-05', '2026-06-19', NULL, 'Issued'),
('BK003', 'STU2025002', 'Sneha P', '2026-06-02', '2026-06-16', '2026-06-15', 'Returned');

-- 10. Seed Chat History
DELETE FROM chat_history;
INSERT INTO chat_history (id, student_id, question, answer, topic, timestamp) VALUES 
('MSG001', 'STU2025001', 'What are the college timings?', 'College operating hours are from 8:30 AM to 3:30 PM, Monday through Friday.', 'timings', '2026-06-13 10:10:00'),
('MSG002', 'STU2025001', 'Tell me about computer science courses', 'We offer B.Sc CS, BCA (3 Years) and M.Sc CS (2 Years).', 'courses', '2026-06-13 10:12:00'),
('MSG003', 'STU2025002', 'What is the highest package in placements?', 'The highest package is ₹18 LPA by Google.', 'placements', '2026-06-13 11:00:00'),
('MSG004', 'STU2025002', 'When are the internal exams?', 'Internal Assessment I starts August 20, 2026.', 'exams', '2026-06-13 11:05:00'),
('MSG005', 'STU2025003', 'Tell me about hostel fees', 'Hostel and mess charges are ₹65,000 per year.', 'fees', '2026-06-13 11:22:00'),
('MSG006', 'STU2025003', 'Is there a library on campus?', 'Yes, open from 8:00 AM to 8:00 PM with 55,000+ books.', 'library', '2026-06-13 11:24:00');

-- 11. Seed Notices Table
DELETE FROM notices;
INSERT INTO notices (id, title, content, summary, date, category, priority, created_by) VALUES 
('NOTICE001', 'End Semester Exams Schedule - November 2026', 'The End Semester Exams for all B.Sc, BCA, B.Com, BBA, and B.A programs are scheduled to commence on November 18, 2026. The detailed timetable will be published on the college portal by October 15, 2026. All students must clear their outstanding tuition fees by September 30, 2026, to receive hall tickets. Practical examinations and lab viva sessions will be conducted between November 2 and November 10, 2026. Hall tickets will be issued by the respective heads of departments starting November 12. A minimum attendance of 75% is strictly mandatory to sit for exams.', 'End Semester Exams commence Nov 18, 2026. Timetable releases by Oct 15. Fees must be cleared by Sept 30. Lab sessions run Nov 2-10. Hall tickets issued from Nov 12. 75% attendance mandatory.', '2026-06-12', 'Exams', 'Urgent', 'Exam Controller'),
('NOTICE002', 'Google Campus Recruitment Drive 2026', 'We are thrilled to announce that Google will be visiting our campus for a recruitment drive on August 24, 2026, for the role of Software Engineer. Eligibility Criteria: B.Sc CS, BCA, and B.Sc Mathematics students with minimum CGPA of 8.5, no standing backlogs, and excellent coding skills. Package details: Highest compensation package of up to 18 LPA. Interested and eligible candidates must register on the placement portal by June 30, 2026. A mock online coding assessment will be organized by the Placement Cell on July 15, 2026, to prepare registered students.', 'Google recruiting for Software Engineer on Aug 24, 2026. CS, BCA, and Math eligibility: 8.5+ CGPA, no backlogs. Package: Up to 18 LPA. Register by June 30. Mock coding test on July 15.', '2026-06-10', 'Placements', 'Important', 'Placement Director'),
('NOTICE003', 'Annual Cultural Fest - ''CAMPUS FLAME 2026''', 'Get ready to experience the biggest college festival of the year! ''CAMPUS FLAME 2026'' will be held on September 11 and 12, 2026. The event features over 30 inter-collegiate competitions, including battle of bands, fashion show, choreo night, hackathons, and street plays. The chief guest for the inauguration is actor Madhavan. Registration for internal teams opens on June 20, 2026. All classes will remain suspended for the event days. Cash prizes worth ₹5 Lakhs are to be won.', '''CAMPUS FLAME 2026'' on Sept 11-12, 2026. Over 30 competitions (bands, fashion, hackathon). Chief Guest: Actor Madhavan. Registrations open June 20. Cash prizes of ₹5 Lakhs.', '2026-06-08', 'Events', 'Normal', 'Cultural Head'),
('NOTICE004', 'Annual Sports Meet - ''CAMPUS ATHLETICS 2026''', 'We are pleased to announce that the Annual Sports Meet ''CAMPUS ATHLETICS 2026'' is scheduled to be held on October 24, 2026, at the college sports ground. Events include 100m, 200m, 400m, relay races, long jump, high jump, shot put, and inter-departmental tournaments for cricket, football, and badminton. Registration for events begins on September 1, 2026, with the physical education director. Cash prizes and rolling trophies will be awarded to the winning departments.', '''CAMPUS ATHLETICS 2026'' scheduled for October 24, 2026. Includes athletics and team sports (cricket, football, badminton). Register from Sept 1. Trophies & cash prizes for winners.', '2026-06-13', 'Events', 'Normal', 'Physical Director');

-- 12. Seed Events Table
DELETE FROM events;
INSERT INTO events (id, title, date, time, location, description, organizer, status) VALUES 
('EVENT001', 'Computational CS Hackathon 2026', '2026-07-05', '09:00 AM', 'Main Seminar Hall', 'Build smart applications for community impact using modern web APIs.', 'CS Department', 'Completed'),
('EVENT002', 'Google Placement Drive', '2026-08-24', '08:30 AM', 'Placement Cell Block B', 'Campus recruitment for final year B.Sc CS, BCA, and B.Sc Math.', 'Placement Cell', 'Upcoming'),
('EVENT003', 'Campus Flame Cultural Fest', '2026-09-11', '10:00 AM', 'Open Air Auditorium', 'Annual inter-collegiate cultural extravaganza.', 'Student Union', 'Upcoming'),
('EVENT004', 'Linguistics & Creative Writing Seminar', '2026-10-12', '09:30 AM', 'English Dept Seminar Hall', 'Keynotes on contemporary literature, poetry, and content writing.', 'English Dept', 'Upcoming');
