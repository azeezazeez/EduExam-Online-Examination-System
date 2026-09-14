package com.examination.controller;

import com.examination.dto.PaymentRequest;
import com.examination.dto.ApiResponse;
import com.examination.model.Payment;
import com.examination.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<Payment>> processPayment(
            @RequestParam Integer userId,
             @RequestBody PaymentRequest request) {

        try {
            Payment payment = paymentService.processPayment(userId, request);
            payment.setCardNumber(null);
            return ResponseEntity.ok(ApiResponse.success("Payment successful", payment));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Boolean>> getPaymentStatus(
            @RequestParam Integer userId) {
        boolean hasPaid = paymentService.hasUserPaid(userId);
        return ResponseEntity.ok(ApiResponse.success("Payment status", hasPaid));
    }
}