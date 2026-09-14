package com.examination.repository;

import com.examination.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    List<Answer> findByUserId(Integer userId);

    Optional<Answer> findByUserIdAndQuestionId(Integer userId, Integer questionId);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.userId = :userId")
    long countAttemptedQuestions(@Param("userId") Integer userId);

    @Query("SELECT COUNT(a) FROM Answer a WHERE a.userId = :userId AND a.isCorrect = true")
    long countCorrectAnswers(@Param("userId") Integer userId);

    @Query("SELECT a.questionId FROM Answer a WHERE a.userId = :userId")
    List<Integer> findAnsweredQuestionIds(@Param("userId") Integer userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Answer a WHERE a.userId = :userId")
    void deleteAllByUserId(@Param("userId") Integer userId);
}