package com.project.library.management.exception;

public class ISBNExistsException extends LMSException{
    public ISBNExistsException(){
        super("ISBN already exists.");
    }
}
