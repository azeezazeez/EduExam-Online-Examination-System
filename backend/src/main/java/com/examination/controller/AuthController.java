package com.examination.controller;

import com.examination.dto.LoginRequest;
import com.examination.dto.RegisterRequest;
import com.examination.dto.ApiResponse;
import com.examination.dto.LoginResponse;
import com.examination.model.User;
import com.examination.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login( @RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(request.getUsernameOrEmail(), request.getPassword());

            LoginResponse response = new LoginResponse(
                    user.getUserId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPaymentStatus()
            );

            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register( @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
//            user.setPassword(null); // Don't return password
            return ResponseEntity.ok(ApiResponse.success("Registration successful", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}