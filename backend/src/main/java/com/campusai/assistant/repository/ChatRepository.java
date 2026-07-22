package com.campusai.assistant.repository;

import com.campusai.assistant.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByStudentId(String studentId);
}
