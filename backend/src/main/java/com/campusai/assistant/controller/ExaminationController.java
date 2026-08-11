package com.campusai.assistant.controller;

import com.campusai.assistant.entity.Examination;
import com.campusai.assistant.service.ExaminationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
@CrossOrigin(origins = "*")
public class ExaminationController {

    @Autowired
    private ExaminationService examinationService;

    @GetMapping
    public ResponseEntity<List<Examination>> getAllExaminations() {
        return ResponseEntity.ok(examinationService.getAllExaminations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Examination> getExaminationById(@PathVariable Long id) {
        return examinationService.getExaminationById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Examination> saveExamination(@RequestBody Examination exam) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examinationService.saveExamination(exam));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamination(@PathVariable Long id) {
        examinationService.deleteExamination(id);
        return ResponseEntity.noContent().build();
    }
}
