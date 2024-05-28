package com.project.library.management.service;

import com.project.library.management.dto.FineDTO;
import com.project.library.management.dto.FinePaginationDTO;
import com.project.library.management.exception.NoFineFoundException;

public interface FineService {
    FinePaginationDTO viewFine(int pageNumber, int pageSize, String sortBy, String sortDir, String username)
            throws NoFineFoundException;

    void runDailyTask();
}
