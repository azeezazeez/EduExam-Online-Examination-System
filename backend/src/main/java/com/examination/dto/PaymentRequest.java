package com.examination.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotBlank(message = "Payment type is required")
    @Pattern(regexp = "^(card|upi)$")
    private String paymentType;

    @Pattern(regexp = "^[0-9]{16}$", message = "Card number must be 16 digits")
    private String cardNumber;

    @Pattern(regexp = "^[0-9]{3}$", message = "CVV must be 3 digits")
    private String cvv;

    @Pattern(regexp = "^[\\w.-]+@[\\w]+$", message = "Invalid UPI ID format")
    private String upiId;

    @NotNull(message = "Amount is required")
    private Double amount;
}