package com.project.library.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.core.annotation.Order;

import java.util.List;

@Data
@Entity
@Table(name = "publisher")
@Order(1)
public class Publisher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long publisherId;

    @Column(name = "publisher_name", nullable = false)
    private String name;

    private String email;

    private String phoneNo;

    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL)
    private List<Book> books;




    // Getters and setters omitted for brevity
}

