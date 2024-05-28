package com.project.library.management.exception;

public class UserNotFoundException extends LMSException {
    public UserNotFoundException(){
        super("User Not Found!!");
    }

    public UserNotFoundException(String message){
        super(message);
    }
}
