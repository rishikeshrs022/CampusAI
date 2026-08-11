package com.campusai.assistant.repository;

import com.campusai.assistant.entity.LibraryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryTransactionRepository extends JpaRepository<LibraryTransaction, Long> {
    List<LibraryTransaction> findByStudentId(String studentId);
}
