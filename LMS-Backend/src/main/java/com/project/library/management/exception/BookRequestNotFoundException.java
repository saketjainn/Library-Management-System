package com.project.library.management.exception;

public class BookRequestNotFoundException extends LMSException{
        public BookRequestNotFoundException() {
            super("Book Request Not found!!");
        }

        public BookRequestNotFoundException(String message) {
            super(message);
        }
}
