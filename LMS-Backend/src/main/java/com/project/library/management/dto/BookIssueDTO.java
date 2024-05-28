package com.project.library.management.dto;

import com.project.library.management.entity.Fine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookIssueDTO {

    private Long issueId;

    private Long bookId;

    private String bookTitle;

    private String userId;

    private Date issueDate;

    private Date dueDate;

    private Date returnDate;

    private Long requestId;

    private int fine;

    private Fine fineStatus;

}

