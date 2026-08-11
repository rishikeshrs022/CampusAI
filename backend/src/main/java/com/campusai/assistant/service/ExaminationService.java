package com.campusai.assistant.service;

import com.campusai.assistant.entity.Examination;
import com.campusai.assistant.repository.ExaminationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExaminationService {

    @Autowired
    private ExaminationRepository examinationRepository;

    public List<Examination> getAllExaminations() {
        return examinationRepository.findAll();
    }

    public Optional<Examination> getExaminationById(Long id) {
        return examinationRepository.findById(id);
    }

    public Examination saveExamination(Examination exam) {
        return examinationRepository.save(exam);
    }

    public void deleteExamination(Long id) {
        examinationRepository.deleteById(id);
    }
}
