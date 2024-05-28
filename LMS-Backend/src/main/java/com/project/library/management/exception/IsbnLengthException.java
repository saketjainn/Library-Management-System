package com.project.library.management.exception;

public class IsbnLengthException extends ValidationException{

    public IsbnLengthException() {
        super("ISBN must be 13 characters long");
    }

    public IsbnLengthException(String message) {
        super(message);
    }
}
