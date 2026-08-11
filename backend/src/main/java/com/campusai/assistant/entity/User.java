package com.campusai.assistant.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
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

    // Constructors
    public User() {}

    public User(String id, String username, String password, String role, String refId) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.refId = refId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRefId() { return refId; }
    public void setRefId(String refId) { this.refId = refId; }
}
