package com.project.library.management.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDTO {
    private Long bookId;
    private String bookTitle;
    private int weeksRequested;
    private String status;
    private Long requestId;
    private String username;
    private Date requestDate;
    private int quantityAvailable;
}
