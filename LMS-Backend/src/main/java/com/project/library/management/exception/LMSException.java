package com.project.library.management.exception;

public class LMSException extends Exception {
    public LMSException(String message) {
        super(message);
    }
    public LMSException() {
        super("LMS Exception occured!!");
    }
}
