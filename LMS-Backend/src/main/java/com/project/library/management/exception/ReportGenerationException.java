package com.project.library.management.exception;

public class ReportGenerationException extends LMSException {
    public ReportGenerationException() {
        super("Failed to generate report.");
    }
    public ReportGenerationException(String message) {
        super(message);
    }
}
