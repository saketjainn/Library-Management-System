package com.project.library.management.service;

import com.project.library.management.entity.RefreshToken;
import com.project.library.management.entity.User;
import com.project.library.management.exception.RefreshTokenNotFound;
import com.project.library.management.repository.RefreshTokenRepository;
import com.project.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService{
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private UserRepository userRepository;

    public RefreshToken createRefreshToken(String username) {
        User user = userRepository.findByUsername(username).orElseThrow( () -> new UsernameNotFoundException("User Not Found to create Refresh Token"));


        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(30L *24*60*60*1000))
                .build();
        refreshTokenRepository.save(refreshToken);

        user.getRefreshToken().add(refreshToken);
        userRepository.save(user);

        return refreshToken;
    }

    public Optional<RefreshToken> findByToken(String token) throws RefreshTokenNotFound{


        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken validateRefreshToken( RefreshToken token) {
       if(token.getExpiryDate().isBefore(Instant.now())){
           refreshTokenRepository.delete(token);
           throw new RuntimeException(token.getToken()+"refresh Token Expired");
       }
       return token;
    }

    public Object verifyExpiration(RefreshToken refreshToken) {
        return refreshToken.getExpiryDate().isBefore(Instant.now());
    }

    public Object deleteByToken(String refreshToken) throws RefreshTokenNotFound {

        findByToken(refreshToken).ifPresent(refreshTokenRepository::delete);
        return "Refresh Token Deleted Successfully";
    }

    public void deleteAllByUsername(String username){
        User user = userRepository.findByUsername(username).orElseThrow( () -> new UsernameNotFoundException("User Not Found to delete Refresh Token"));
        refreshTokenRepository.deleteAllByUser(user);
    }
}
