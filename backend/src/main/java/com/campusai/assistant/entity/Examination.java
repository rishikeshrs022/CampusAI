package com.campusai.assistant.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "examinations")
public class Examination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_name", nullable = false)
    private String examName;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private String date; // YYYY-MM-DD

    @Column(nullable = false)
    private String time;

    @Column(nullable = false)
    private String room;

    @Column(nullable = false)
    private String status; // Upcoming, Completed

    // Constructors
    public Examination() {}

    public Examination(Long id, String examName, String subject, String department, Integer semester, String date, String time, String room, String status) {
        this.id = id;
        this.examName = examName;
        this.subject = subject;
        this.department = department;
        this.semester = semester;
        this.date = date;
        this.time = time;
        this.room = room;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
