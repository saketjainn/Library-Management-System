package com.project.library.management.dto;

import com.project.library.management.entity.AuthenticationResponse;
import lombok.Data;

@Data
public class Temp {
    private AuthenticationResponse authenticationResponse;
    private String role;
}
