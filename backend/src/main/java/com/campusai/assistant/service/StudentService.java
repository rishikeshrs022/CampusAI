package com.campusai.assistant.service;

import com.campusai.assistant.entity.Student;
import com.campusai.assistant.entity.User;
import com.campusai.assistant.repository.StudentRepository;
import com.campusai.assistant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }

    @Transactional
    public Student createStudent(Student student) {
        // Encrypt the password before saving
        String rawPassword = student.getPassword() != null ? student.getPassword() : "password123";
        String encryptedPassword = passwordEncoder.encode(rawPassword);
        
        student.setPassword(encryptedPassword);
        Student savedStudent = studentRepository.save(student);

        // Mirror this student as an authorized system user
        User user = new User();
        user.setId("U" + UUID.randomUUID().toString().substring(0, 8));
        user.setUsername(student.getId()); // Use student ID as login username
        user.setPassword(encryptedPassword);
        user.setRole("ROLE_STUDENT");
        user.setRefId(student.getId());
        userRepository.save(user);

        return savedStudent;
    }

    @Transactional
    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
        // Clean up linked credential user
        userRepository.findByUsername(id).ifPresent(user -> userRepository.delete(user));
    }
}
