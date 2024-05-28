package com.project.library.management.exception;

public class BookAlreadyExistsException extends LMSException{


    public BookAlreadyExistsException(){
        super("The entered Book already exists. Please try with another Book.");
    }

}
