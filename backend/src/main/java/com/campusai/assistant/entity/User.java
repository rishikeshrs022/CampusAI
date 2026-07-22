package com.campusai.assistant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id; // e.g. U001

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // hashed with BCrypt

    @Column(nullable = false)
    private String role; // ROLE_STUDENT, ROLE_ADMIN

    @Column(name = "ref_id")
    private String refId; // Links to Student.id or NULL for admin
}
