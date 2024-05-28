package com.project.library.management.exception;

public class AuthenticationException extends LMSException{
    public AuthenticationException(String message){
        super(message);
    }

    public AuthenticationException(){
        super("Please Login and Authenticate!!");
    }
}
