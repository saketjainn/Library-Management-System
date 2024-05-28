package com.project.library.management.controller;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.project.library.management.dto.ErrorDTO;
import com.project.library.management.exception.AuthenticationException;
import com.project.library.management.exception.LMSException;
import com.project.library.management.exception.ValidationException;

@Controller
@ControllerAdvice
public class ExceptionHandlerController {

        @ExceptionHandler(AuthenticationException.class)
        protected ResponseEntity<ErrorDTO> handleAuthenticationException(AuthenticationException e){
                return new ResponseEntity<>(
                        ErrorDTO
                                .builder()
                                .message(e.getMessage())
                                .status(HttpStatus.UNAUTHORIZED)//HttpStatus Code:401
                                .timestamp(new Date())
                                .build(),
                        HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(ValidationException.class)
        protected ResponseEntity<ErrorDTO> handleValidationException(ValidationException e){
                return new ResponseEntity<>(
                        ErrorDTO
                                .builder()
                                .message(e.getMessage())
                                .status(HttpStatus.UNPROCESSABLE_ENTITY)//HttpStatus Code:422
                                .timestamp(new Date())
                                .build(),
                        HttpStatus.UNPROCESSABLE_ENTITY);
        }

        @ExceptionHandler(LMSException.class)
        protected ResponseEntity<ErrorDTO> handleLMSException(LMSException e) {
                return new ResponseEntity<>(
                        ErrorDTO
                                .builder()
                                .message(e.getMessage())
                                .status(HttpStatus.BAD_REQUEST)//HttpStatus Code:400
                                .timestamp(new Date())
                                .build(),
                        HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(Exception.class)
        protected ResponseEntity<ErrorDTO> handleException(Exception e){
                return new ResponseEntity<>(
                        ErrorDTO
                                .builder()
                                .message(e.getMessage())
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)//HttpStatus Code:500
                                .timestamp(new Date())
                                .build(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
