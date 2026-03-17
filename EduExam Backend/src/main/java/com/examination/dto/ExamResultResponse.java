package com.examination.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultResponse {
    private int totalQuestions;
    private int attempted;
    private int correctAnswers;
    private int wrongAnswers;
    private int score;
    private double percentage;
    private String grade;
}