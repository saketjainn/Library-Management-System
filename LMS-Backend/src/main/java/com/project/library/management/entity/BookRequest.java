package com.project.library.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.core.annotation.Order;

import java.util.Date;

@Data
@Entity
@Table(name = "book_request")
@Order(3)
public class BookRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private Date requestDate;

    @Column(nullable = false)
    @Min(1)
    @Max(3)
    private int weeksRequested;

    @OneToOne(mappedBy = "bookRequest")
    private BookIssue bookIssue;

    @Column(nullable = false)
    private String status = "PENDING";
    // Getters and setters omitted for brevity
}

