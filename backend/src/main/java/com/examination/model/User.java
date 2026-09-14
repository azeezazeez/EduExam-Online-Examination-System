package com.examination.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 10)
    private String pincode;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;


    @Column(length = 50)
    private String education;

    @Column(name = "payment_status")
    private Boolean paymentStatus = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}