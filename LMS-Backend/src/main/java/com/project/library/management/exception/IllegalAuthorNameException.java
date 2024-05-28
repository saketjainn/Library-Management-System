package com.project.library.management.exception;

public class IllegalAuthorNameException extends LMSException {
    public IllegalAuthorNameException(){
        super("Author name should be between 3 and 50 characters.");
    }
}
