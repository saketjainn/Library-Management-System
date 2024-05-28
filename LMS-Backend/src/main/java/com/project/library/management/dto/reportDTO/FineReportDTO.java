package com.project.library.management.dto.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FineReportDTO {
    private String username;
    private String name;
    private Long totalFineAmountPaid;
    private Long totalFineAmountDue;
}
