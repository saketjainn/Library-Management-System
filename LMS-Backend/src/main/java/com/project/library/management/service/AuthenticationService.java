package com.project.library.management.service;

import com.project.library.management.dto.LoginDTO;
import com.project.library.management.dto.RefreshTokenRequestDTO;
import com.project.library.management.dto.UserDTO;
import com.project.library.management.entity.AuthenticationResponse;
import com.project.library.management.exception.*;

import java.util.UUID;

public interface AuthenticationService {
    AuthenticationResponse register(UserDTO request) throws PasswordLengthException, MobileNoExistsException, UserNameExistsExecption, IllegalMobileNoException, AddressLengthException, UsernameLengthException, NameLengthException, InvalidEmailException, InvalidPasswordException, EmailExistsException, InvalidNameException;

    AuthenticationResponse authenticate(LoginDTO request) throws InvalidCredentialException;

    boolean usernameExists(String usernameToCheck);

    AuthenticationResponse refreshToken(RefreshTokenRequestDTO request) throws RefreshTokenNotFound;

    String getUserRole(String username);

    void logout(String username, String Token) throws RefreshTokenNotFound;

    int forgetPassword(String email) throws UserNotFoundException;

    void resetPassword(UUID token, String password) throws OTPException, InvalidPasswordException;
    UUID verifyOtp(String email, String otp) throws OTPException;





}
