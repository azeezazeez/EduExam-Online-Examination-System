package com.examination.repository;

import com.examination.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    @Query("SELECT COUNT(q) FROM Question q")
    long getTotalQuestions();

    @Query("SELECT q.qId FROM Question q ORDER BY q.qId")
    List<Integer> findAllQuestionIds();
}