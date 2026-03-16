package com.examination.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AnswerRequest {
    @NotNull(message = "Question ID is required")
    private Integer questionId;

    @NotNull(message = "Selected option is required")
    private String selectedOption;
}