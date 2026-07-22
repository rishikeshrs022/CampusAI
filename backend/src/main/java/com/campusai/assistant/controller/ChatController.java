package com.campusai.assistant.controller;

import com.campusai.assistant.entity.ChatMessage;
import com.campusai.assistant.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId");
        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Map<String, String> chatbotResponse = chatbotService.getChatResponse(studentId, question);
        return ResponseEntity.ok(chatbotResponse);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getAllHistory() {
        List<ChatMessage> history = chatbotService.getAllChatHistory();
        return ResponseEntity.ok(history);
    }

    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<ChatMessage>> getStudentHistory(@PathVariable String studentId) {
        List<ChatMessage> history = chatbotService.getChatHistory(studentId);
        return ResponseEntity.ok(history);
    }
}
