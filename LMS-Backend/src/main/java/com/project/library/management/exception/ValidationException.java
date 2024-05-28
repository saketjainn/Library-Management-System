package com.project.library.management.exception;

public class ValidationException extends LMSException {
    public ValidationException(){
        super("Please Enter Valid data!!");
    }

    public ValidationException(String message) {
        super(message);
    }
}
