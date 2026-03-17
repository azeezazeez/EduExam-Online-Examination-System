package com.examination.repository;

import com.examination.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByUserId(Integer userId);

    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.userId = :userId AND p.paymentStatus = 'SUCCESS'")
    boolean hasSuccessfulPayment(@Param("userId") Integer userId);
}