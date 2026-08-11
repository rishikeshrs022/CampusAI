package com.campusai.assistant.service;

import com.campusai.assistant.entity.Book;
import com.campusai.assistant.entity.LibraryTransaction;
import com.campusai.assistant.repository.BookRepository;
import com.campusai.assistant.repository.LibraryTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LibraryService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private LibraryTransactionRepository transactionRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }

    public List<LibraryTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<LibraryTransaction> getTransactionsByStudent(String studentId) {
        return transactionRepository.findByStudentId(studentId);
    }

    public Optional<LibraryTransaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public LibraryTransaction saveTransaction(LibraryTransaction tx) {
        return transactionRepository.save(tx);
    }

    @Transactional
    public LibraryTransaction issueBook(String bookId, String studentId, String studentName) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            if (book.getAvailableQuantity() > 0) {
                book.setAvailableQuantity(book.getAvailableQuantity() - 1);
                bookRepository.save(book);

                LibraryTransaction tx = new LibraryTransaction();
                tx.setBookId(bookId);
                tx.setStudentId(studentId);
                tx.setStudentName(studentName);
                tx.setIssueDate(LocalDate.now().toString());
                tx.setDueDate(LocalDate.now().plusDays(14).toString());
                tx.setStatus("Issued");
                return transactionRepository.save(tx);
            }
        }
        throw new RuntimeException("Book copy not available.");
    }

    @Transactional
    public LibraryTransaction returnBook(Long transactionId) {
        Optional<LibraryTransaction> txOpt = transactionRepository.findById(transactionId);
        if (txOpt.isPresent()) {
            LibraryTransaction tx = txOpt.get();
            if ("Issued".equals(tx.getStatus()) || "Overdue".equals(tx.getStatus())) {
                tx.setReturnDate(LocalDate.now().toString());
                tx.setStatus("Returned");
                transactionRepository.save(tx);

                Optional<Book> bookOpt = bookRepository.findById(tx.getBookId());
                if (bookOpt.isPresent()) {
                    Book book = bookOpt.get();
                    book.setAvailableQuantity(book.getAvailableQuantity() + 1);
                    bookRepository.save(book);
                }
                return tx;
            }
        }
        throw new RuntimeException("Transaction not found or book already returned.");
    }
}
