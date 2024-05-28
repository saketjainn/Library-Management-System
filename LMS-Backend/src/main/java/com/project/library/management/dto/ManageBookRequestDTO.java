package com.project.library.management.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ManageBookRequestDTO { // diff from that in master rn
    private String username;
    private String bookTitle;
    private Date requestDate;
    private Long requestId;
    private int weeksRequested;
    private String status;
}
