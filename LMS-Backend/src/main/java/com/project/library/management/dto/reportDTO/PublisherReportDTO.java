package com.project.library.management.dto.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublisherReportDTO {
    private Long publisherId;
    private String name;
    private String email;
    private String phoneNo;
}
