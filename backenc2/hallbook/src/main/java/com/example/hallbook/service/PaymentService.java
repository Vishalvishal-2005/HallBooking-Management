package com.example.hallbook.service;

import com.example.hallbook.entity.PaymentTransaction;
import com.example.hallbook.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentTransactionRepository transactionRepository;

    public PaymentTransaction saveTransaction(PaymentTransaction tx) {
        return transactionRepository.save(tx);
    }

    public Optional<PaymentTransaction> findByTransactionId(String id) {
        return transactionRepository.findByTransactionId(id);
    }
}
