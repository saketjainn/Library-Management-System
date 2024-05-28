package com.project.library.management.dto.reportDTO;

import com.project.library.management.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReportDTO {
    private String username;
    private String name;
    private String mobileNo;
    private String address;
    private String role;
    
}
