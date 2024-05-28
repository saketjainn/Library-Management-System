package com.project.library.management.exception;

public class PasswordLengthException extends ValidationException{
    public PasswordLengthException(){
        super("Password length should be between 8 and 20 characters.");
    }

    public PasswordLengthException(String message) {
        super(message);
    }
}
