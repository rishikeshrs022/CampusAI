package com.campusai.assistant.service;

import com.campusai.assistant.entity.ChatMessage;
import com.campusai.assistant.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ChatbotService {

    @Autowired
    private ChatRepository chatRepository;

    private static final Map<String, String> CHAT_ANSWERS = new HashMap<>();

    static {
        CHAT_ANSWERS.put("timings", "College operating hours are from <b>8:30 AM to 3:30 PM</b>, Monday through Friday. Lunch break is from <b>12:15 PM to 1:15 PM</b>.");
        CHAT_ANSWERS.put("departments", "CampusAI features 6 premier engineering departments:<br>1. <b>CSE</b> (Computer Science)<br>2. <b>IT</b> (Information Technology)<br>3. <b>ECE</b> (Electronics & Communication)<br>4. <b>EEE</b> (Electrical & Electronics)<br>5. <b>ME</b> (Mechanical Engineering)<br>6. <b>CE</b> (Civil Engineering).");
        CHAT_ANSWERS.put("courses", "We offer the following undergraduate and postgraduate courses:<br>• <b>B.E. / B.Tech</b> (CSE, IT, ECE, EEE, Mech, Civil) - 4 Years<br>• <b>M.E. / M.Tech</b> - 2 Years<br>• <b>Ph.D. Research Programs</b>.");
        CHAT_ANSWERS.put("admission", "Admission is conducted through the Single Window Counselling (TNEA code: 2100) or via management quota. Contact: <b>admissions@campusai.edu</b>.");
        CHAT_ANSWERS.put("fees", "Tuition Fees per academic year:<br>• <b>Government Quota</b>: ₹55,000 / year<br>• <b>Management Quota</b>: ₹1,20,000 / year<br>• <b>Hostel & Mess</b>: ₹65,000 / year.");
        CHAT_ANSWERS.put("exams", "Key Exam dates for 2026:<br>• <b>Internal Assessment I</b>: August 20, 2026<br>• <b>Internal Assessment II</b>: October 5, 2026<br>• <b>End Semester Theory Exams</b>: November 18, 2026 onwards.");
        CHAT_ANSWERS.put("placements", "Placement Record: <b>95% of students</b> were placed in 2025. Highest Package: ₹42 LPA (Google), Average Package: ₹6.5 LPA.");
        CHAT_ANSWERS.put("hostel", "Separate hostels for boys and girls with 24/7 Wi-Fi (100 Mbps), gym, indoor sports complex, veg & non-veg mess.");
        CHAT_ANSWERS.put("library", "Central Library open <b>8:00 AM to 8:00 PM</b>. 55,000+ books, IEEE access, and digital libraries.");
        CHAT_ANSWERS.put("faculty", "150+ highly qualified faculty. More than 45% hold Ph.D. degrees from prestigious institutes like IITs, NITs, and Anna University.");
    }

    public Map<String, String> getChatResponse(String studentId, String question) {
        String q = question.toLowerCase();
        String answer;
        String topic;

        if (q.contains("timing") || q.contains("hours") || q.contains("schedule") || q.contains("time")) {
            answer = CHAT_ANSWERS.get("timings");
            topic = "timings";
        } else if (q.contains("department") || q.contains("branch") || q.contains("stream")) {
            answer = CHAT_ANSWERS.get("departments");
            topic = "departments";
        } else if (q.contains("course") || q.contains("program") || q.contains("degree") || q.contains("offer")) {
            answer = CHAT_ANSWERS.get("courses");
            topic = "courses";
        } else if (q.contains("admission") || q.contains("apply") || q.contains("join") || q.contains("tnea")) {
            answer = CHAT_ANSWERS.get("admission");
            topic = "admission";
        } else if (q.contains("fee") || q.contains("cost") || q.contains("payment") || q.contains("expense")) {
            answer = CHAT_ANSWERS.get("fees");
            topic = "fees";
        } else if (q.contains("exam") || q.contains("internal") || q.contains("test") || q.contains("assess") || q.contains("timetable")) {
            answer = CHAT_ANSWERS.get("exams");
            topic = "exams";
        } else if (q.contains("placement") || q.contains("recruit") || q.contains("job") || q.contains("salary") || q.contains("package") || q.contains("company")) {
            answer = CHAT_ANSWERS.get("placements");
            topic = "placements";
        } else if (q.contains("hostel") || q.contains("mess") || q.contains("room") || q.contains("boarding")) {
            answer = CHAT_ANSWERS.get("hostel");
            topic = "hostel";
        } else if (q.contains("library") || q.contains("book") || q.contains("journal")) {
            answer = CHAT_ANSWERS.get("library");
            topic = "library";
        } else if (q.contains("faculty") || q.contains("teacher") || q.contains("professor") || q.contains("staff")) {
            answer = CHAT_ANSWERS.get("faculty");
            topic = "faculty";
        } else {
            answer = "I'm sorry, I couldn't find a direct answer. CampusAI can help you with: Timings, Departments, Courses, Admission, Fees, Exams, Placements, Hostel, Library, and Faculty details.";
            topic = "other";
        }

        // Save interaction history
        ChatMessage chatMsg = new ChatMessage();
        chatMsg.setId("MSG" + UUID.randomUUID().toString().substring(0, 8));
        chatMsg.setStudentId(studentId != null ? studentId : "GUEST");
        chatMsg.setQuestion(question);
        chatMsg.setAnswer(answer);
        chatMsg.setTopic(topic);
        chatMsg.setTimestamp(LocalDateTime.now());
        chatRepository.save(chatMsg);

        Map<String, String> response = new HashMap<>();
        response.put("answer", answer);
        response.put("topic", topic);
        return response;
    }

    public List<ChatMessage> getChatHistory(String studentId) {
        return chatRepository.findByStudentId(studentId);
    }

    public List<ChatMessage> getAllChatHistory() {
        return chatRepository.findAll();
    }
}
