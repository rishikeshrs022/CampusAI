package com.campusai.assistant.repository;

import com.campusai.assistant.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByDate(String date);
}
