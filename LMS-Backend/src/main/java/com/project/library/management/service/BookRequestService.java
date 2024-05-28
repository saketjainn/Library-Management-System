package com.project.library.management.service;

import com.project.library.management.dto.BookRequestDTO;
import com.project.library.management.dto.BookRequestPaginationDTO;
import com.project.library.management.dto.ManageBookRequestDTO;
import com.project.library.management.dto.ViewRequestsDTO;
import com.project.library.management.exception.*;

import java.util.List;

public interface BookRequestService {
    boolean issueRequest(String username, BookRequestDTO bookRequestDTO) throws BookNotFoundException,DisabledBookException, BookAlreadyRequestedExecption, IllegalWeeksRequestedException, FineLimitExcededException, RequestedLimitExcededException;

    boolean cancelRequest(Long requestId) throws BookRequestNotFoundException;

    boolean acceptRequest(Long requestId)
            throws BookRequestNotFoundException, BookNotFoundException, DisabledBookException, FineLimitExcededException, BookOutOfStockException;

    boolean declineRequest(Long requestId) throws BookRequestNotFoundException;

    BookRequestPaginationDTO viewRequests(int pageNumber, int pageSize, String sortBy, String sortDir,
                                           String filterBy) throws BookRequestNotFoundException;

    BookRequestPaginationDTO viewRequestsByUserName(int pageNumber, int pageSize, String sortBy,
                                                     String sortDir, String username, String filterBy)
            throws BookRequestNotFoundException, UserNotFoundException;

    List<ViewRequestsDTO> viewRequest(String userName) throws BookRequestNotFoundException;

    List<ManageBookRequestDTO> getLast10BookRequests() throws BookRequestNotFoundException;

    List<ManageBookRequestDTO> searchRequestsByUsername(String username);
}
