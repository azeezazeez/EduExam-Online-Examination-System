package com.examination.controller;

import com.examination.dto.AnswerRequest;
import com.examination.dto.ApiResponse;
import com.examination.dto.ExamResultResponse;
import com.examination.dto.QuestionResponse;
import com.examination.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exam")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ExamController {

    private final ExamService examService;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getAllQuestions(
            @RequestParam Integer userId) {
        List<QuestionResponse> questions = examService.getAllQuestions(userId);
        return ResponseEntity.ok(ApiResponse.success("Questions retrieved", questions));
    }

    @PostMapping("/answers")
    public ResponseEntity<ApiResponse<Void>> saveAnswer(
            @RequestParam Integer userId,
            @Valid @RequestBody AnswerRequest request) {

        examService.saveAnswer(userId, request.getQuestionId(), request.getSelectedOption());
        return ResponseEntity.ok(ApiResponse.success("Answer saved", null));
    }

    @GetMapping("/answers")
    public ResponseEntity<ApiResponse<Map<Integer, String>>> getAllAnswers(
            @RequestParam Integer userId) {
        Map<Integer, String> answers = examService.getAllSavedAnswers(userId);
        return ResponseEntity.ok(ApiResponse.success("Answers retrieved", answers));
    }

    @GetMapping("/result")
    public ResponseEntity<ApiResponse<ExamResultResponse>> getResult(
            @RequestParam Integer userId) {
        ExamResultResponse result = examService.calculateResult(userId);
        return ResponseEntity.ok(ApiResponse.success("Result calculated", result));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<ExamResultResponse>> submitExam(
            @RequestParam Integer userId) {
        ExamResultResponse result = examService.submitAndResetExam(userId);
        return ResponseEntity.ok(ApiResponse.success("Exam submitted", result));
    }

    @GetMapping("/total-questions")
    public ResponseEntity<ApiResponse<Long>> getTotalQuestions() {
        long total = examService.getTotalQuestions();
        return ResponseEntity.ok(ApiResponse.success("Total questions", total));
    }
}