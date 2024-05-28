package com.project.library.management.exception;

public class BookIssueNotFoundException extends LMSException {
    public BookIssueNotFoundException(){
        super("Book issue Not Found!!");
    }
    public BookIssueNotFoundException(String message){
        super(message);
    }
}
