package com.project.library.management.exception;

public class NameLengthException   extends ValidationException{
    public NameLengthException(){
        super("Name length should be between 3 and 100 characters.");
    }
}
