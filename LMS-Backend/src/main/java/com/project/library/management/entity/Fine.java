package com.project.library.management.entity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Fine {
    PAID("PAID"),
    NOFINE("NOFINE"),
    UNPAID("UNPAID");
    private final String Fine;
}
