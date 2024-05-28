package com.project.library.management.service;

import com.project.library.management.dto.UserActivityDTO;

import java.util.List;

public interface UserActivityService {

    List<UserActivityDTO> getUserActivityReport();
}
