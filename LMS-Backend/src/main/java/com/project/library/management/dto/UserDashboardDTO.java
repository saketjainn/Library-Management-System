package com.project.library.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Data

public class UserDashboardDTO {
    private Map<String, Long> genreWiseSplit;
    private Map<String, Long> favoriteBooks;
    private Map<String, Long> favoriteAuthors;
    private Long totalBooksBorrowed;
    private Integer totalDuesAmount;
}
