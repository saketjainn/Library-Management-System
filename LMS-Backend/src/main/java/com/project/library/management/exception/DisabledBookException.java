package com.project.library.management.exception;

public class DisabledBookException extends LMSException{
    public DisabledBookException(){
        super("Book is Disabled!!");
    }

    public DisabledBookException(String message) {
        super(message);
    }
}
