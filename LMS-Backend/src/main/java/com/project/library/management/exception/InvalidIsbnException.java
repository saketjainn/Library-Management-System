package com.project.library.management.exception;

public class InvalidIsbnException extends LMSException{
    public InvalidIsbnException(){
        super("Enter a valid ISBN");
    }
}
