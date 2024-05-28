package com.project.library.management.service;
import com.project.library.management.dto.AdminDashboardDTO;
import com.project.library.management.repository.BookIssueRepository;
import com.project.library.management.repository.BookRepository;
import com.project.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookIssueRepository bookIssueRepository;

    public Map<String, Long> getGenreWiseSplit() {
        List<Object[]> genreCounts = bookRepository.getGenreWiseSplit();

        Map<String, Long> genreWiseSplit = genreCounts.stream()
                .collect(Collectors.toMap(
                        array -> (String) array[0], // Genre
                        array -> ((BigDecimal) array[1]).longValue()    // Count
                ));

//        AdminDashboardDTO admindashboardDTO = new AdminDashboardDTO();
//        admindashboardDTO.setGenreWiseSplit(genreWiseSplit);
        return genreWiseSplit;
    }

    public Map<String, Long> calculateAdminDashboardData() {
//        int limit=5;
        List<Object[]> bookCounts = bookIssueRepository.getMostRequestedBooks();

        Map<String, Long> mostRequestedBooks = bookCounts.stream()
                .collect(Collectors.toMap(
                        array -> (String) array[0], // Book Title
                        array -> (Long) array[1]   // Request Count
                ));

//        AdminDashboardDTO adminDashboardDTO = new AdminDashboardDTO();
//        adminDashboardDTO.setMostRequestedBooks(mostRequestedBooks);

        return mostRequestedBooks;
    }
    public int getTotalBooksAvailable() {
        return bookRepository.getTotalBooksAvailable();
    }
    public int getTotalUsersAvailable() {
        return userRepository.getTotalUsersAvailable();
    }

    public Map<String,Long> getTopAuthorsWithBooksIssued() {
        List<Object[]> topAuthorsWithBooksIssued = bookIssueRepository.findTopAuthorsWithBooksIssued();


        Map<String, Long> topAuthors = new HashMap<>();

        for (Object[] result : topAuthorsWithBooksIssued) {
            String author = (String) result[0];
            Long bookCount = (Long) result[1];
            topAuthors.put(author, bookCount);
        }

//        adminDashboardDTO.setTopAuthorsWithBooksIssued(topAuthors);

        return topAuthors;
    }

    public Map<String, Long> getTotalFinesPaidVersusDue() {
        List<Object[]> result = bookIssueRepository.getTotalFinesPaidAndDue();

        AdminDashboardDTO adminDashboardDTO = new AdminDashboardDTO();
        Map<String, Long> totalFines = new HashMap<>();

        if (!result.isEmpty() && result.get(0) != null && result.get(0).length >= 2) {
            totalFines.put("totalFinesPaid", (Long) result.get(0)[0]); // Assuming fines are of type Long
            totalFines.put("totalFinesDue", (Long) result.get(0)[1]);  // Assuming fines are of type Long
        } else {
            totalFines.put("totalFinesPaid", 0L);
            totalFines.put("totalFinesDue", 0L);
        }

//        adminDashboardDTO.setTotalFines(totalFines);

        return totalFines;
    }
}

