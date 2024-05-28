package com.project.library.management.exception;

public class InvalidCredentialException extends AuthenticationException{

    public InvalidCredentialException(String message) {
        super(message);
    }


}
