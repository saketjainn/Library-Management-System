package com.project.library.management.service;

import com.project.library.management.dto.FinePaginationDTO;
import com.project.library.management.dto.UserDTO;
import com.project.library.management.dto.UserPaginationDTO;
import com.project.library.management.dto.UserProfile;
import com.project.library.management.entity.User;
import com.project.library.management.exception.AddressLengthException;
import com.project.library.management.exception.IllegalMobileNoException;
import com.project.library.management.exception.MobileNoExistsException;
import com.project.library.management.exception.NoFineFoundException;
import com.project.library.management.exception.NothingToUpdateException;
import com.project.library.management.exception.UserNotFoundException;

import java.util.Optional;

public interface UserService {

    boolean isUsernameAvailable(String username);

    UserDTO getUserByUsername(String username);

    UserProfile getUserProfile(String username) throws UserNotFoundException;

    UserPaginationDTO getAllUsers(int pageNumber, int pageSize, String sortBy, String sortDir) throws UserNotFoundException;

    UserPaginationDTO getUserByUsername(int pageNumber, int pageSize, String sortBy, String sortDir, String username) throws UserNotFoundException;

    FinePaginationDTO viewFine(int pageNumber, int pageSize, String sortBy, String sortDir, String username) throws NoFineFoundException;

    Optional<User> getUserByUsernameforDashboard(String username);

    UserProfile updateUser(String username, UserProfile userProfile) throws UserNotFoundException, IllegalMobileNoException, MobileNoExistsException, NothingToUpdateException, AddressLengthException;
}
