package com.project.library.management.entity;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private String token;
    private String refreshToken;
    public AuthenticationResponse(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }



}
