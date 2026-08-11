package com.campusai.assistant.controller;

import com.campusai.assistant.entity.Book;
import com.campusai.assistant.entity.LibraryTransaction;
import com.campusai.assistant.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "*")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(libraryService.getAllBooks());
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return libraryService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/books")
    public ResponseEntity<Book> saveBook(@RequestBody Book book) {
        return ResponseEntity.status(HttpStatus.CREATED).body(libraryService.saveBook(book));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        libraryService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<LibraryTransaction>> getAllTransactions() {
        return ResponseEntity.ok(libraryService.getAllTransactions());
    }

    @GetMapping("/transactions/student/{studentId}")
    public ResponseEntity<List<LibraryTransaction>> getTransactionsByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(libraryService.getTransactionsByStudent(studentId));
    }

    @PostMapping("/issue")
    public ResponseEntity<LibraryTransaction> issueBook(@RequestBody Map<String, String> payload) {
        try {
            String bookId = payload.get("bookId");
            String studentId = payload.get("studentId");
            String studentName = payload.get("studentName");
            LibraryTransaction tx = libraryService.issueBook(bookId, studentId, studentName);
            return ResponseEntity.status(HttpStatus.CREATED).body(tx);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/return/{transactionId}")
    public ResponseEntity<LibraryTransaction> returnBook(@PathVariable Long transactionId) {
        try {
            LibraryTransaction tx = libraryService.returnBook(transactionId);
            return ResponseEntity.ok(tx);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
