package com.project.library.management.service;

import java.util.Map;

public interface AdminDashboardService {
    Map<String, Long> getGenreWiseSplit();
    
    Map<String, Long> calculateAdminDashboardData();
    
    int getTotalBooksAvailable();
    
    int getTotalUsersAvailable();
    
    Map<String, Long> getTopAuthorsWithBooksIssued();
    
    Map<String, Long> getTotalFinesPaidVersusDue();
}
