package com.project.library.management.service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class Testmail {

    private final MailServiceImpl mailServiceImpl;




    public void sendEmail(String to, String from, String subject, String body) {
        mailServiceImpl.sendEmail(to, from, subject, body);
    }
}
