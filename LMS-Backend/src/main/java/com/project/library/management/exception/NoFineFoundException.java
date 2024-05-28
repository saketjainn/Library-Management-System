package com.project.library.management.exception;

public class NoFineFoundException extends LMSException {
    public NoFineFoundException(){
        super("No Fine Found!!");
    }
    public NoFineFoundException(String message){
        super(message);
    }
}
