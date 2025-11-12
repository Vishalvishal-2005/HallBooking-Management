
// File: entity/PaymentTransaction.java
package com.example.hallbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 50)
    private String paymentMethod;
    
    @Column(unique = true, length = 100)
    private String transactionId;
    
    @Column(length = 50)
    private String paymentGateway;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String gatewayResponse;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
