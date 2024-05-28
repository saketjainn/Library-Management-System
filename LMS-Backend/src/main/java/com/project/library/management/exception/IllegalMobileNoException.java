package com.project.library.management.exception;

public class IllegalMobileNoException extends ValidationException{
    public IllegalMobileNoException(){
        super("Mobile No. should contain 10 digits!!");
    }

    public IllegalMobileNoException(String message){
        super(message);
    }
}
