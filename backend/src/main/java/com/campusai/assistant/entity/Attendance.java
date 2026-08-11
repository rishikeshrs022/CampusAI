package com.campusai.assistant.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String date; // YYYY-MM-DD

    @Column(nullable = false)
    private String department;

    @Column(name = "academic_year", nullable = false)
    private Integer year;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String status; // Present, Absent

    // Constructors
    public Attendance() {}

    public Attendance(Long id, String date, String department, Integer year, String studentId, String status) {
        this.id = id;
        this.date = date;
        this.department = department;
        this.year = year;
        this.studentId = studentId;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
