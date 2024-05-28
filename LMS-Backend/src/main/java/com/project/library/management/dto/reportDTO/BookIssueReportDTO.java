package com.project.library.management.dto.reportDTO;

import java.util.Date;

import com.project.library.management.entity.Fine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookIssueReportDTO {
    private Long issueId;

    private String bookTitle;

    private String username;

    private Date issueDate;

    private Date dueDate;

    private Date returnDate;

    private int fine;

    private Fine fineStatus;
}
