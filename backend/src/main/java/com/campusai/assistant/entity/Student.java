package com.campusai.assistant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    private String id; // e.g. STUDENT001

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private Double attendance;

    @Column(nullable = false)
    private Double cgpa;
}
