package com.project.library.management.repository;

import com.project.library.management.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpRepository extends JpaRepository<OTP, Long> {

    Optional<OTP> findByUserEmail(String email);

    Optional<OTP> findByToken(UUID token);
}
