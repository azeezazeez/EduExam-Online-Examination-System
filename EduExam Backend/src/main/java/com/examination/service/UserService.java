package com.examination.service;

import com.examination.dto.RegisterRequest;
import com.examination.model.User;
import com.examination.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public User registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, encode this
        user.setPincode(request.getPincode());
        user.setCity(request.getCity());
        user.setEducation(request.getEducation());
        user.setPaymentStatus(false);

        // Save and return
        return userRepository.save(user);
    }

    public User loginUser(String usernameOrEmail, String password) {
        // Find user by username or email
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("User not found with username/email: " + usernameOrEmail));

        // Check password
        if (!user.getPassword().equals(password)) { // In production, use password encoder
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    @Transactional
    public void updatePaymentStatus(Integer userId) {
        User user = getUserById(userId);
        user.setPaymentStatus(true);
        userRepository.save(user);
    }
}