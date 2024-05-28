package com.project.library.management.service;

import com.project.library.management.entity.RefreshToken;
import com.project.library.management.exception.RefreshTokenNotFound;

import java.util.Optional;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(String username);

    Optional<RefreshToken> findByToken(String token) throws RefreshTokenNotFound;

    RefreshToken validateRefreshToken(RefreshToken token);

    Object verifyExpiration(RefreshToken refreshToken);

    Object deleteByToken(String refreshToken) throws RefreshTokenNotFound;

    void deleteAllByUsername(String username);
}
