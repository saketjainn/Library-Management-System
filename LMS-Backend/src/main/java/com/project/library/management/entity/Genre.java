package com.project.library.management.entity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@RequiredArgsConstructor
public enum Genre {

    SCIENCE_FICTION("SCI-FI"),
    SELF_HELP("SELF_HELP"),
    THRILLER("THRILLER"),
    EDUCATIONAL("EDUCATIONAL"),
    HISTORICAL_FICTION("HISTORICAL_FICTION"),
    OTHERS("OTHERS");

    private final String displayName;
    public String getDisplayName() {
        return displayName;
    }
}
