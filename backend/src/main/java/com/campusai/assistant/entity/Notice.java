package com.campusai.assistant.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notices")
public class Notice {

    @Id
    private String id; // NOTICE001

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary; // AI generated summary points

    @Column(nullable = false)
    private String date; // YYYY-MM-DD

    @Column(nullable = false)
    private String category; // Exams, Placements, Events, General

    @Column(nullable = false)
    private String priority; // Normal, Important, Urgent

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    // Constructors
    public Notice() {}

    public Notice(String id, String title, String content, String summary, String date, String category, String priority, String createdBy) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.date = date;
        this.category = category;
        this.priority = priority;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
