package com.project.library.management.exception;

public class UsernameLengthException extends ValidationException{

        public UsernameLengthException(){
            super("Username length should be between 3 and 10 characters.");
        }
}
