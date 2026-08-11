package com.campusai.assistant.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @Column(name = "dept_key")
    private String deptKey; // e.g. "cs", "it"

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String icon;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String programs; // Comma-separated list

    @Column(name = "students_count", nullable = false)
    private Integer studentsCount;

    @Column(nullable = false)
    private Integer sections;

    @Column(name = "tuition_fee", nullable = false)
    private String tuitionFee;

    @Column(name = "lab_fee", nullable = false)
    private String labFee;

    @Column(name = "exam_fee", nullable = false)
    private String examFee;

    @Column(name = "total_fee", nullable = false)
    private String totalFee;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String facilities;

    // Constructors
    public Department() {}

    public Department(String deptKey, String name, String icon, String programs, Integer studentsCount, Integer sections, String tuitionFee, String labFee, String examFee, String totalFee, String facilities) {
        this.deptKey = deptKey;
        this.name = name;
        this.icon = icon;
        this.programs = programs;
        this.studentsCount = studentsCount;
        this.sections = sections;
        this.tuitionFee = tuitionFee;
        this.labFee = labFee;
        this.examFee = examFee;
        this.totalFee = totalFee;
        this.facilities = facilities;
    }

    // Getters and Setters
    public String getDeptKey() { return deptKey; }
    public void setDeptKey(String deptKey) { this.deptKey = deptKey; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getPrograms() { return programs; }
    public void setPrograms(String programs) { this.programs = programs; }

    public Integer getStudentsCount() { return studentsCount; }
    public void setStudentsCount(Integer studentsCount) { this.studentsCount = studentsCount; }

    public Integer getSections() { return sections; }
    public void setSections(Integer sections) { this.sections = sections; }

    public String getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(String tuitionFee) { this.tuitionFee = tuitionFee; }

    public String getLabFee() { return labFee; }
    public void setLabFee(String labFee) { this.labFee = labFee; }

    public String getExamFee() { return examFee; }
    public void setExamFee(String examFee) { this.examFee = examFee; }

    public String getTotalFee() { return totalFee; }
    public void setTotalFee(String totalFee) { this.totalFee = totalFee; }

    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }
}
