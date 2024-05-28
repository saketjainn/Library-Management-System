package com.project.library.management.exception;

public class AddressLengthException extends ValidationException {
    public AddressLengthException(String message){
        super(message);
    }

    public AddressLengthException(){
        super("Length of Address should be less 30 characters!!");
    }
}
