package com.project.library.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.core.annotation.Order;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "otp")
@Order(1)
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String otp;

    private Instant expiry;

    @OneToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    private UUID token;

    private Instant tokenExpiryTime;
}
