package com.campusai.assistant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    private String id; // MSG + timestamp

    @Column(name = "student_id")
    private String studentId; // links to Student ID or remains 'GUEST'

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false)
    private String topic; // timings, departments, fee, etc.

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
