-- ========================================================
-- CampusAI - MySQL Database Initial Seed Data (Arts & Science)
-- Passwords are BCrypt encrypted with strength 10:
-- student123 -> $2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO
-- admin123   -> $2a$10$R9nC.lO7H5O3H5C4n1d9u.1J8z5XqC5C4n1d9uqG.vLzV3ZkH8w2j
-- ========================================================

USE campusai_db;

-- 1. Seed Students Table
INSERT INTO students (id, name, email, password, department, year, phone, attendance, cgpa) VALUES 
('STUDENT001', 'Rahul Sharma', 'rahul.sharma@campusai.edu', '$2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO', 'Computer Science & BCA', 3, '+91 98765 43210', 86.5, 8.75),
('STUDENT002', 'Priya Patel', 'priya.patel@campusai.edu', '$2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO', 'Commerce & BBA', 4, '+91 98765 43211', 92.0, 9.15),
('STUDENT003', 'Arjun Kumar', 'arjun.kumar@campusai.edu', '$2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO', 'Physics', 2, '+91 98765 43212', 74.5, 7.20);

-- 2. Seed Users Table (For Role Based Access Controls - Spring Security)
INSERT INTO users (id, username, password, role, ref_id) VALUES 
('U001', 'STUDENT001', '$2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO', 'ROLE_STUDENT', 'STUDENT001'),
('U002', 'STUDENT002', '$2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO', 'ROLE_STUDENT', 'STUDENT002'),
('U003', 'STUDENT003', '$2a$10$gP1D0H4Lp.oN9aC3wz8hxe6O4qT5C2l5H0Y3qZ2G4t5D2Z.k2x7iO', 'ROLE_STUDENT', 'STUDENT003'),
('U004', 'admin', '$2a$10$R9nC.lO7H5O3H5C4n1d9u.1J8z5XqC5C4n1d9uqG.vLzV3ZkH8w2j', 'ROLE_ADMIN', NULL);

-- 3. Seed Notices Table
INSERT INTO notices (id, title, content, summary, date, category) VALUES 
('NOTICE001', 'End Semester Exams Schedule - November 2026', 'The End Semester Exams for all B.Sc, BCA, B.Com, BBA, and B.A programs are scheduled to commence on November 18, 2026. The detailed timetable will be published on the college portal by October 15, 2026. All students must clear their outstanding tuition fees by September 30, 2026, to receive hall tickets. Practical examinations and lab viva sessions will be conducted between November 2 and November 10, 2026. Hall tickets will be issued by the respective heads of departments starting November 12. A minimum attendance of 75% is strictly mandatory to sit for exams.', 'End Semester Exams commence Nov 18, 2026. Timetable releases by Oct 15. Fees must be cleared by Sept 30. Lab sessions run Nov 2-10. Hall tickets issued from Nov 12. 75% attendance mandatory.', '2026-06-12', 'Exams'),
('NOTICE002', 'Google Campus Recruitment Drive 2026', 'We are thrilled to announce that Google will be visiting our campus for a recruitment drive on August 24, 2026, for the role of Software Engineer. Eligibility Criteria: B.Sc CS, BCA, and B.Sc Mathematics students with minimum CGPA of 8.5, no standing backlogs, and excellent coding skills. Package details: Highest compensation package of up to 18 LPA. Interested and eligible candidates must register on the placement portal by June 30, 2026. A mock online coding assessment will be organized by the Placement Cell on July 15, 2026, to prepare registered students.', 'Google recruiting for Software Engineer on Aug 24, 2026. CS, BCA, and Math eligibility: 8.5+ CGPA, no backlogs. Package: Up to 18 LPA. Register by June 30. Mock coding test on July 15.', '2026-06-10', 'Placements'),
('NOTICE003', 'Annual Cultural Fest - \'CAMPUS FLAME 2026\'', 'Get ready to experience the biggest college festival of the year! \'CAMPUS FLAME 2026\' will be held on September 11 and 12, 2026. The event features over 30 inter-collegiate competitions, including battle of bands, fashion show, choreo night, hackathons, and street plays. The chief guest for the inauguration is actor Madhavan. Registration for internal teams opens on June 20, 2026. All classes will remain suspended for the event days. Cash prizes worth ₹5 Lakhs are to be won.', '\'CAMPUS FLAME 2026\' on Sept 11-12, 2026. Over 30 competitions (bands, fashion, hackathon). Chief Guest: Actor Madhavan. Registrations open June 20. Cash prizes of ₹5 Lakhs.', '2026-06-08', 'Events'),
('NOTICE004', 'Annual Sports Meet - \'CAMPUS ATHLETICS 2026\'', 'We are pleased to announce that the Annual Sports Meet \'CAMPUS ATHLETICS 2026\' is scheduled to be held on October 24, 2026, at the college sports ground. Events include 100m, 200m, 400m, relay races, long jump, high jump, shot put, and inter-departmental tournaments for cricket, football, and badminton. Registration for events begins on September 1, 2026, with the physical education director. Cash prizes and rolling trophies will be awarded to the winning departments.', '\'CAMPUS ATHLETICS 2026\' scheduled for October 24, 2026. Includes athletics and team sports (cricket, football, badminton). Register from Sept 1. Trophies & cash prizes for winners.', '2026-06-13', 'Events'),
('NOTICE005', 'Annual Alumni Reunion 2026', 'CampusAI Arts & Science College cordially invites all our alumni to the Annual Reunion Meet on December 5, 2026. Reconnect with professors, interact with current students, and witness the growth of our institution. The event includes a panel discussion on industry trends, department visits, and a cultural evening followed by dinner. Registration is free but mandatory via the alumni portal link by November 15, 2026.', 'Annual Alumni Reunion on December 5, 2026. Reconnect, panel discussions, department visits, and dinner. Free registration on portal by November 15.', '2026-06-13', 'Events');

-- 4. Seed Events Table
INSERT INTO events (id, title, date, time, location, description) VALUES 
('EVENT001', 'Computational CS Hackathon 2026', '2026-07-05', '09:00 AM', 'Main Seminar Hall', 'Build smart applications for community impact using modern web APIs.'),
('EVENT002', 'Google Placement Drive', '2026-08-24', '08:30 AM', 'Placement Cell Block B', 'Campus recruitment for final year B.Sc CS, BCA, and B.Sc Math.'),
('EVENT003', 'Campus Flame Cultural Fest', '2026-09-11', '10:00 AM', 'Open Air Auditorium', 'Annual inter-collegiate cultural extravaganza.'),
('EVENT004', 'Linguistics & Creative Writing Seminar', '2026-10-12', '09:30 AM', 'English Dept Seminar Hall', 'Keynotes on contemporary literature, poetry, and content writing.'),
('EVENT005', 'End Semester Exams', '2026-11-18', '10:00 AM', 'Exam Halls A-F', 'Semester examinations for all departments.'),
('EVENT006', 'Annual Sports Meet 2026', '2026-10-24', '08:00 AM', 'College Playground', 'Inter-departmental track, field, and indoor sports tournaments.'),
('EVENT007', 'Alumni Meet 2026', '2026-12-05', '10:30 AM', 'Main Seminar Hall', 'Annual gathering of alumni from all graduated batches.');

-- 5. Seed Chat History (Sample interactions to populate dashboard graphs)
INSERT INTO chat_history (id, student_id, question, answer, topic, timestamp) VALUES 
('MSG001', 'STUDENT001', 'What are the college timings?', 'College operating hours are from 8:30 AM to 3:30 PM, Monday through Friday.', 'timings', '2026-06-13 10:10:00'),
('MSG002', 'STUDENT001', 'Tell me about computer science courses', 'We offer B.Sc CS, BCA (3 Years) and M.Sc CS (2 Years).', 'courses', '2026-06-13 10:12:00'),
('MSG003', 'STUDENT002', 'What is the highest package in placements?', 'The highest package is ₹18 LPA by Google.', 'placements', '2026-06-13 11:00:00'),
('MSG004', 'STUDENT002', 'When are the internal exams?', 'Internal Assessment I starts August 20, 2026.', 'exams', '2026-06-13 11:05:00'),
('MSG005', 'STUDENT003', 'Tell me about hostel fees', 'Hostel and mess charges are ₹65,000 per year.', 'fees', '2026-06-13 11:22:00'),
('MSG006', 'STUDENT003', 'Is there a library on campus?', 'Yes, open from 8:00 AM to 8:00 PM with 55,000+ books.', 'library', '2026-06-13 11:24:00');
