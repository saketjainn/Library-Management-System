package com.project.library.management.service;

import com.project.library.management.dto.BookIssuePaginationDTO;
import com.project.library.management.exception.BookIssueNotFoundException;
import com.project.library.management.exception.UserNotFoundException;

public interface BookIssueService {
    BookIssuePaginationDTO viewBorrowedBooks(String username, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookIssueNotFoundException, UserNotFoundException;

    boolean acceptReturn(Long issueId) throws BookIssueNotFoundException;
}
