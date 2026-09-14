package com.examination.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "payment_type", length = 20)
    private String paymentType;

    @Column(name = "card_number", length = 20)
    private String cardNumber;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Column(name = "amount")
    private Double amount = 499.0;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "SUCCESS";

    @Column(name = "payment_date")
    private LocalDateTime paymentDate = LocalDateTime.now();
}