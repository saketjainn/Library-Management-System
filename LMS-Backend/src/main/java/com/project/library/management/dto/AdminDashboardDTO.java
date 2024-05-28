package com.project.library.management.dto;

import lombok.*;

import java.util.Map;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDTO {
    private Map<String, Long> genreWiseSplit;
    private Map<String, Long> mostRequestedBooks;
    private int totalBooksAvailable;
    private int totalUsers;
    private Map<String,Long> TopAuthorsWithBooksIssued;
    private Map<String, Long> totalFines;
}
