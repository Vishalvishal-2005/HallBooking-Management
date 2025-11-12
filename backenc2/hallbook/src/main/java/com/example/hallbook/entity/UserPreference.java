
// File: entity/UserPreference.java
package com.example.hallbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String preferredCities;
    
    @Column(columnDefinition = "TEXT")
    private String preferredHallTypes;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMin;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMax;
    
    private Integer preferredCapacityMin;
    
    private Integer preferredCapacityMax;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
