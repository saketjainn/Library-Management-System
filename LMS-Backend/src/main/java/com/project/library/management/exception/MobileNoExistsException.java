package com.project.library.management.exception;

public class MobileNoExistsException extends ValidationException{

    public  MobileNoExistsException(String message) {
        super(message);
    }

    public MobileNoExistsException(){
        super("The entered Mobile No. already exists. Please try with another Mobile No.");
    }
}
