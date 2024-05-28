package com.project.library.management.exception;

public class IllegalTitleException  extends LMSException{
    public IllegalTitleException(){
        super("Title should be between 3 and 50 characters.");
    }
}
