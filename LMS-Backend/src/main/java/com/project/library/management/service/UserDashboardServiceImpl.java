package com.project.library.management.service;

import com.project.library.management.dto.UserDashboardDTO;
import com.project.library.management.entity.Fine;
import com.project.library.management.entity.Genre;
import com.project.library.management.entity.User;
import com.project.library.management.repository.BookIssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserDashboardServiceImpl implements UserDashboardService{

    @Autowired
    private BookIssueRepository bookIssueRepository;

    public Map<String, Long> getGenreWiseSplitForUser(User user) {
        List<Object[]> genreWiseSplit = bookIssueRepository.getGenreWiseSplitByUser(user);

        UserDashboardDTO userDashboardDTO = new UserDashboardDTO();
        Map<String, Long> genreSplit = new HashMap<>();

        for (Object[] result : genreWiseSplit) {
            Genre genre = (Genre) result[0];
            Long count = (Long) result[1];
            genreSplit.put(genre.getDisplayName(), count); // Assuming Genre has a getName() method
        }

        return genreSplit;
    }

    public Map<String, Long> getFavoriteBooksForUser(User user) {
        List<Object[]> favoriteBooks = bookIssueRepository.getFavoriteBooksByUser(user);

        Map<String, Long> favoriteBooksMap = new HashMap<>();

        for (Object[] result : favoriteBooks) {
            String bookTitle = (String) result[0];
            Long issueCount = (Long) result[1];
            favoriteBooksMap.put(bookTitle, issueCount);
        }

        return favoriteBooksMap;
    }

    public Map<String,Long> getFavoriteAuthorsForUser(User user) {
        List<Object[]> favoriteAuthors = bookIssueRepository.getFavoriteAuthorsByUser(user);

        Map<String, Long> favoriteAuthorsMap = new HashMap<>();

        for (Object[] result : favoriteAuthors) {
            String authorName = (String) result[0];
            Long readCount = (Long) result[1];
            favoriteAuthorsMap.put(authorName, readCount);
        }

        return favoriteAuthorsMap;
    }

    public Long getTotalBooksBorrowedByUser(User user) {
        return bookIssueRepository.getTotalBooksBorrowedByUser(user);
    }
    public Integer getTotalDuesAmountForUser(String username) {
        Integer totalFineAmountDue= bookIssueRepository.getUsersWithTotalFineAmountDue(Fine.UNPAID,username);
        if(totalFineAmountDue == null){
            return 0;
        }
        return totalFineAmountDue;
    }
}
