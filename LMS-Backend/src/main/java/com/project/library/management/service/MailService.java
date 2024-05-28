package com.project.library.management.service;

public interface MailService {
    void sendEmail(String to, String from, String subject, String body);
}
