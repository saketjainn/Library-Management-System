package com.project.library.management.exception;

public class NothingToUpdateException extends LMSException{



        public NothingToUpdateException(){
            super("Nothing to update. Please try with another value.");
        }
}
