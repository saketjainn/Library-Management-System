package com.project.library.management.exception;

public class BookAlreadyRequestedExecption extends LMSException{
    public BookAlreadyRequestedExecption(){
        super("Book Already Requested!!");
    }
    public BookAlreadyRequestedExecption(String message){
        super(message);
    }
}
