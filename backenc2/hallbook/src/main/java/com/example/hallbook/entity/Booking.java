// File: entity/Booking.java
package com.example.hallbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Proper User mapping — JPA will create a user_id column automatically
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ✅ Proper Hall mapping — JPA will create a hall_id column automatically
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    private Hall hall;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal durationHours;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(length = 100)
    private String eventType;

    private Integer guestCount;

    @Column(columnDefinition = "TEXT")
    private String specialRequests;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(length = 100)
    private String paymentId;

    @Column(columnDefinition = "TEXT")
    private String cancellationReason;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ✅ Optional: Convenience method to get userId directly
    @Transient
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    // ✅ Optional: Convenience method to get hallId directly
    @Transient
    public Long getHallId() {
        return hall != null ? hall.getId() : null;
    }
}
