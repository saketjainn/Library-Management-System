package com.project.library.management.controller;

import com.project.library.management.dto.LoginDTO;
import com.project.library.management.dto.RefreshTokenRequestDTO;
import com.project.library.management.dto.Temp;
import com.project.library.management.dto.UserDTO;
import com.project.library.management.entity.AuthenticationResponse;
import com.project.library.management.exception.*;
import com.project.library.management.service.AuthenticationService;
import com.project.library.management.service.MailServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/auth")

public class AuthenticationController {

	private final AuthenticationService authService;


	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register(@RequestBody UserDTO request) throws PasswordLengthException, MobileNoExistsException, UserNameExistsExecption, AddressLengthException, IllegalMobileNoException, UsernameLengthException, NameLengthException, InvalidEmailException, InvalidPasswordException, EmailExistsException, InvalidNameException {
        System.out.println("Got the request"+request.getEmail());
		return ResponseEntity.ok(authService.register(request));
	}

    public AuthenticationController(AuthenticationService authService, MailServiceImpl mailServiceImpl) {
        this.authService = authService;


    }









    @PostMapping("/login")
    public ResponseEntity<Temp> login(
            @RequestBody LoginDTO request
    ) throws InvalidCredentialException {
        Temp temp = new Temp();
        temp.setAuthenticationResponse(authService.authenticate(request));
        temp.setRole(authService.getUserRole(request.getUsername()));
        return ResponseEntity.ok(temp);

    }

    @PostMapping("/refreshToken")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @RequestBody RefreshTokenRequestDTO request
    ) throws RefreshTokenNotFound {
        System.out.println("Got the request"+request);
        AuthenticationResponse authenticationResponse = authService.refreshToken(request);
        return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
           @RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO, HttpServletRequest request
    ) throws RefreshTokenNotFound {
        String username = request.getUserPrincipal().getName();
        authService.logout(username, refreshTokenRequestDTO.getRefreshToken());
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/forgotPassword")
    public ResponseEntity<String> forgotPassword(
            @RequestParam("email") String email
    ) throws UserNotFoundException, OTPException {
        System.out.println("Email is "+email);
        authService.forgetPassword(email);
        System.out.println("Mail sent successfully");
        return ResponseEntity.ok("Mail sent successfully");
    }

    @GetMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp
    ) throws  OTPException {
        System.out.println("Email is "+email);
        System.out.println("OTP is "+otp);
        UUID token = authService.verifyOtp(email, otp);
        return ResponseEntity.ok(token.toString());
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam("token") String token,
            @RequestParam("password") String password
    ) throws OTPException, InvalidPasswordException {
        System.out.println("Token is "+token);
        authService.resetPassword(UUID.fromString(token), password);
        return ResponseEntity.ok("Password reset successfully");
    }
}
