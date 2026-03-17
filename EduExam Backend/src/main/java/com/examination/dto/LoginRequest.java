package com.examination.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Username/Email is required")
    private String usernameOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}