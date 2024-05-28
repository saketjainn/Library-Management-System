package com.project.library.management.exception;

public class RefreshTokenNotFound  extends AuthenticationException{
    public RefreshTokenNotFound(String message) {
        super(message);
    }
}
