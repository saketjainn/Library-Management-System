package com.project.library.management.service;

import com.project.library.management.dto.UserActivityDTO;
import com.project.library.management.repository.BookIssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserActivityServiceImpl implements UserActivityService{
    @Autowired
    private BookIssueRepository booksIssuedRepository;

    public List<UserActivityDTO> getUserActivityReport() {
        List<Object[]> result = booksIssuedRepository.findUserActivity();

        return result.stream()
                .map(row -> {
                    UserActivityDTO dto = new UserActivityDTO();
                    dto.setUsername((String) row[0]);
                    dto.setBooksBorrowed(((Number) row[1]).intValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
