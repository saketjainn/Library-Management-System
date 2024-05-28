package com.project.library.management.service;

import com.project.library.management.entity.User;

import java.util.Map;

public interface UserDashboardService {

    Map<String, Long> getGenreWiseSplitForUser(User user);

    Map<String, Long> getFavoriteBooksForUser(User user);

    Map<String, Long> getFavoriteAuthorsForUser(User user);

    Long getTotalBooksBorrowedByUser(User user);

    Integer getTotalDuesAmountForUser(String username);
}
