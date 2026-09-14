package com.examination.service;

import com.examination.model.Payment;
import com.examination.repository.PaymentRepository;
import com.examination.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserService userService;

    @Transactional
    public Payment processPayment(Integer userId, PaymentRequest request) {
        // Check if already paid
        if (paymentRepository.hasSuccessfulPayment(userId)) {
            throw new RuntimeException("User has already made a payment");
        }

        // Validate payment details
        validatePaymentDetails(request);

        // Create payment record
        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setPaymentType(request.getPaymentType());
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus("SUCCESS");

        if ("card".equals(request.getPaymentType())) {
            payment.setCardNumber(maskCardNumber(request.getCardNumber()));
        } else if ("upi".equals(request.getPaymentType())) {
            payment.setUpiId(request.getUpiId());
        }

        Payment savedPayment = paymentRepository.save(payment);

        // Update user payment status
        userService.updatePaymentStatus(userId);

        return savedPayment;
    }

    private void validatePaymentDetails(PaymentRequest request) {
        if ("card".equals(request.getPaymentType())) {
            if (request.getCardNumber() == null || !request.getCardNumber().matches("^[0-9]{16}$")) {
                throw new RuntimeException("Invalid card number");
            }
            if (request.getCvv() == null || !request.getCvv().matches("^[0-9]{3}$")) {
                throw new RuntimeException("Invalid CVV");
            }
        } else if ("upi".equals(request.getPaymentType())) {
            if (request.getUpiId() == null || !request.getUpiId().matches("^[\\w.-]+@[\\w]+$")) {
                throw new RuntimeException("Invalid UPI ID");
            }
        } else {
            throw new RuntimeException("Invalid payment type");
        }
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return cardNumber;
        }
        return "XXXXXXXXXXXX" + cardNumber.substring(cardNumber.length() - 4);
    }

    public boolean hasUserPaid(Integer userId) {
        return paymentRepository.hasSuccessfulPayment(userId);
    }
}