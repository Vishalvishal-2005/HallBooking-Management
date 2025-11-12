package com.example.hallbook.controller;

import com.example.hallbook.entity.PaymentTransaction;
import com.example.hallbook.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentTransaction> create(@RequestBody PaymentTransaction tx) {
        return ResponseEntity.ok(paymentService.saveTransaction(tx));
    }
}
