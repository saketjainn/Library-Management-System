package com.project.library.management.dto.reportDTO;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestReportDTO {
    private Long requestId;
    private String bookTitle;
    private String username;
    private Date requestDate;
    private int weeksRequested;
    private String status;

}
