package com.campusai.assistant.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "library_transactions")
public class LibraryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id", nullable = false)
    private String bookId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(name = "issue_date", nullable = false)
    private String issueDate; // YYYY-MM-DD

    @Column(name = "due_date", nullable = false)
    private String dueDate; // YYYY-MM-DD

    @Column(name = "return_date")
    private String returnDate; // YYYY-MM-DD or NULL

    @Column(nullable = false)
    private String status; // Issued, Returned, Overdue

    // Constructors
    public LibraryTransaction() {}

    public LibraryTransaction(Long id, String bookId, String studentId, String studentName, String issueDate, String dueDate, String returnDate, String status) {
        this.id = id;
        this.bookId = bookId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
