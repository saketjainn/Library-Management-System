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
public class ViewRequestsDTO {

    private Long requestId;

    private Long bookId;

    private String bookTitle;

    private String author;

    private int printYear;

    private Date requestDate;

    private String publisherName;

    private int weeksRequested;

    private String status;
}
