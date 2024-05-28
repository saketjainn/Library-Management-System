package com.project.library.management.exception;

public class PublisherNotFoundException extends LMSException{
    public PublisherNotFoundException() {
        super("Publisher Not Found");
    }
    public PublisherNotFoundException(String message) {
        super(message);
    }
}
