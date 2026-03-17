package com.examination.service;

import com.examination.model.*;
import com.examination.repository.*;
import com.examination.dto.ExamResultResponse;
import com.examination.dto.QuestionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public List<QuestionResponse> getAllQuestions(Integer userId) {
        List<Question> questions = questionRepository.findAll();
        List<Integer> answeredIds = answerRepository.findAnsweredQuestionIds(userId);

        return questions.stream().map(q -> {
            QuestionResponse response = new QuestionResponse();
            response.setQId(q.getQId());
            response.setQuestion(q.getQuestion());
            response.setOptionA(q.getOptionA());
            response.setOptionB(q.getOptionB());
            response.setOptionC(q.getOptionC());
            response.setOptionD(q.getOptionD());

            Optional<Answer> answer = answerRepository.findByUserIdAndQuestionId(userId, q.getQId());
            if (answer.isPresent()) {
                response.setAnswered(true);
                response.setSelectedOption(answer.get().getSelectedOption());
            } else {
                response.setAnswered(false);
            }

            return response;
        }).collect(Collectors.toList());
    }

    public long getTotalQuestions() {
        return questionRepository.count();
    }

    @Transactional
    public void saveAnswer(Integer userId, Integer questionId, String selectedOption) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = answerRepository.findByUserIdAndQuestionId(userId, questionId)
                .orElse(new Answer());

        answer.setUserId(userId);
        answer.setQuestionId(questionId);
        answer.setSelectedOption(selectedOption);
        answer.setIsCorrect(question.getCorrectOption().equals(selectedOption));

        answerRepository.save(answer);
    }

    public Map<Integer, String> getAllSavedAnswers(Integer userId) {
        List<Answer> answers = answerRepository.findByUserId(userId);
        Map<Integer, String> answerMap = new HashMap<>();
        for (Answer answer : answers) {
            answerMap.put(answer.getQuestionId(), answer.getSelectedOption());
        }
        return answerMap;
    }

    @Transactional
    public ExamResultResponse calculateResult(Integer userId) {
        long totalQuestions = questionRepository.count();
        long attempted = answerRepository.countAttemptedQuestions(userId);
        long correct = answerRepository.countCorrectAnswers(userId);
        long wrong = attempted - correct;
        int score = (int) correct;

        double percentage = totalQuestions > 0 ? (correct * 100.0 / totalQuestions) : 0;
        String grade = calculateGrade(percentage);

        ExamResultResponse result = new ExamResultResponse();
        result.setTotalQuestions((int) totalQuestions);
        result.setAttempted((int) attempted);
        result.setCorrectAnswers((int) correct);
        result.setWrongAnswers((int) wrong);
        result.setScore(score);
        result.setPercentage(percentage);
        result.setGrade(grade);

        return result;
    }

    @Transactional
    public ExamResultResponse submitAndResetExam(Integer userId) {
        ExamResultResponse result = calculateResult(userId);
        answerRepository.deleteAllByUserId(userId);
        return result;
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 35) return "D";
        return "F";
    }
}