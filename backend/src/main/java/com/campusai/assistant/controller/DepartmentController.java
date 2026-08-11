package com.campusai.assistant.controller;

import com.campusai.assistant.entity.Department;
import com.campusai.assistant.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/{key}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable String key) {
        return departmentService.getDepartmentById(key)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Department> saveDepartment(@RequestBody Department department) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.saveDepartment(department));
    }

    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String key) {
        departmentService.deleteDepartment(key);
        return ResponseEntity.noContent().build();
    }
}
