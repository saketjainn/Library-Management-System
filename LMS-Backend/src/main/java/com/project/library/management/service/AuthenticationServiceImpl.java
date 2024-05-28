package com.project.library.management.service;

import com.project.library.management.dto.LoginDTO;
import com.project.library.management.dto.RefreshTokenRequestDTO;
import com.project.library.management.dto.UserDTO;
import com.project.library.management.entity.*;
import com.project.library.management.exception.*;
import com.project.library.management.repository.OtpRepository;
import com.project.library.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private static final Logger logger = Logger.getLogger(AuthenticationServiceImpl.class);
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpRepository otpRepository;
    private final MailServiceImpl mailServiceImpl;
    @Value("${spring.mail.username}")
    private String mail;


    public AuthenticationResponse register(UserDTO request) throws PasswordLengthException, MobileNoExistsException, UserNameExistsExecption, IllegalMobileNoException, AddressLengthException, UsernameLengthException, NameLengthException, InvalidEmailException, InvalidPasswordException, EmailExistsException, InvalidNameException {
        if (request.getPassword().length() < 8 || request.getPassword().length() > 20) {
            throw new PasswordLengthException("Password length should be between 8 and 20 characters.");
        }
        if (request.getUsername().length() <= 3 || request.getUsername().length() > 10) {
            throw new UsernameLengthException();
        }

        if (request.getName().length() <= 3 || request.getName().length() >= 100) {
            throw new NameLengthException();
        }

        if(!validateName(request.getName())){
            throw new InvalidNameException("Name should contain only alphabets");
        }

        if(userRepository.existsByUsername(request.getUsername())){
            throw new UserNameExistsExecption("Username already exists");
        }

        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new EmailExistsException("Email already exists");
        }

        if(userRepository.existsByMobileNo(request.getMobileNo())){
            throw new MobileNoExistsException("Mobile Number already exists");
        }

        if(request.getMobileNo().length() != 10){
            throw new IllegalMobileNoException();
        }

        if(request.getAddress().length()>=100){
            throw new AddressLengthException();
        }

        if (!validateEmail(request.getEmail())) {
            throw new InvalidEmailException();
        }

        if(!validatePassword(request.getPassword())){
            throw new InvalidPasswordException("Password should contain atleast one uppercase, one lowercase, one digit and one special character");
        }






        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setMobileNo(request.getMobileNo());
        user.setEmail(request.getEmail());
        user.setRole(Role.USER);
        user = userRepository.save(user);
        logger.debug("Registered a new user into our LMS Portal !");
        String token = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());
        String refreshTokenToken = refreshToken.getToken();

        String subject = "Registration Successful";
        String body = "Welcome to the Library Management System. Your registration is successful. You can now login to the system.";
        String to = user.getEmail();


        mailServiceImpl.sendEmail(to, mail, subject, body);

        return new AuthenticationResponse(token, refreshTokenToken);
    }

    public boolean validateEmail (String email) {
        String regex = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@[\\w-]+(?:\\.[\\w-]+)*$";
        return Pattern.matches(regex, email);
    }

    public boolean validatePassword (String email) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}|<>?]).{8,20}$";
        return Pattern.matches(regex, email);
    }
    public boolean validateName (String name) {
        String regex = "^[a-zA-Z\\\\s]+$";
        return Pattern.matches(regex, name);
    }


    public AuthenticationResponse authenticate(LoginDTO request) throws InvalidCredentialException {
        System.out.println("Authenticate Service");
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()

                    )

            );}
        catch (Exception e){
            throw new InvalidCredentialException("Invalid Credentials!");
        }

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(()->
                new InvalidCredentialException("User not found")
        );
        logger.debug("Query fired for finding the Username for logging in");
        String token = jwtService.generateToken(user);
        logger.info("Generated the Access Token for the user");
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());
        logger.info("Generated the Refresh Token for the user");
        String refreshTokenToken = refreshToken.getToken();

        return new AuthenticationResponse(token, refreshTokenToken);

    }


	public boolean usernameExists(String usernameToCheck) {
		// TODO Auto-generated method stub
		return false;
	}





    public AuthenticationResponse refreshToken(RefreshTokenRequestDTO request) throws RefreshTokenNotFound {
        RefreshToken refreshToken = refreshTokenService.findByToken(request.getRefreshToken()).orElseThrow(
                () -> new RuntimeException("You are logged out! Please login again.")
        );
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token, request.getRefreshToken());
    }



    public String getUserRole(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        logger.debug("Query fired for finding the User by username");
        return user.getRole().name();
    }


    public void logout(String username, String Token) throws RefreshTokenNotFound {

     RefreshToken refreshToken = refreshTokenService.findByToken(Token).orElseThrow(
                () -> new RuntimeException("Refresh token is not in database!")
        );

        if(refreshToken.getUser().getUsername().equals(username)){
                refreshTokenService.deleteByToken(Token);
        }
        else {
            throw new RuntimeException("Token not belongs to the user");
        }
}
    public int forgetPassword(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(()->
                new UserNotFoundException("User not found")
        );
        logger.debug("Query fired for finding the User by email");
        int otp = generateRandomFourDigit();
        logger.info("Generated the OTP for the user");
        OTP existingOtp = otpRepository.findByUserEmail(email).orElse(null);
        if(existingOtp!=null){
            otpRepository.delete(existingOtp);
        }
        OTP otpEntity = new OTP();
        otpEntity.setUser(user);
        otpEntity.setOtp(String.valueOf(otp));
        otpEntity.setExpiry(Instant.now().plusSeconds(120));
        otpRepository.save(otpEntity);
        logger.info("Saved the OTP in the database");
        String subject = "OTP for Password Reset";
        String body = "Your OTP for password reset is: "+otp;
        mailServiceImpl.sendEmail(email,mail,subject,body);

        return otp;

    }



    public UUID verifyOtp(String email, String otp) throws OTPException {
        System.out.println("Email is "+email);
        OTP otpEntity = otpRepository.findByUserEmail(email).orElseThrow(
                () -> new OTPException("Invalid OTP"));

        logger.debug("Query fired for finding the OTP by email");
        if(otpEntity.getExpiry().isBefore(Instant.now())){
            otpRepository.delete(otpEntity);
            throw new OTPException("OTP has expired");
        }
        if(otpEntity.getOtp().equals(otp)){
            UUID token = UUID.randomUUID();

            otpEntity.setToken(token);
            otpEntity.setTokenExpiryTime(Instant.now().plusSeconds(120));
            otpRepository.save(otpEntity);
            return token;
        }
        else {
            throw new OTPException("OTP not found");
        }
    }


    @Transactional
    public void resetPassword(UUID token, String password) throws OTPException, InvalidPasswordException {
        OTP otpEntity = otpRepository.findByToken(token).orElseThrow(
                () -> new OTPException("Token not found"));

        logger.debug("Query fired for finding the OTP by token");
        if(otpEntity.getTokenExpiryTime().isBefore(Instant.now())){
            otpRepository.delete(otpEntity);
            throw new OTPException("Token has expired");
        }
        User user = otpEntity.getUser();
        if (passwordEncoder.matches(password, user.getPassword())) {
            throw new OTPException("New password cannot be the same as the current password");
        }
        if(!validatePassword(password)){
            throw new InvalidPasswordException("Password should contain atleast one uppercase, one lowercase, one digit and one special character");
        }
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        otpRepository.delete(otpEntity);
        logoutfromalldevices(user.getUsername());


    }

    public void logoutfromalldevices(String username) {

        refreshTokenService.deleteAllByUsername(username);
    }

    public static int generateRandomFourDigit() {
        // Define minimum and maximum values for a 4-digit number (inclusive)
        int min = 1000;
        int max = 9999;

        // Create a random number generator object
        Random random = new Random();

        // Generate a random integer between min (inclusive) and max (exclusive)
        int randomNumber = random.nextInt(max - min + 1) + min;

        return randomNumber;
    }

}
