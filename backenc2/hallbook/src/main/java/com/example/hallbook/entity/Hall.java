
// File: entity/Hall.java
package com.example.hallbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "halls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @Column(nullable = false, length = 150)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false, length = 100)
    private String city;
    
    @Column(length = 100)
    private String state;
    
    @Column(length = 10)
    private String pincode;
    
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HallType hallType = HallType.OTHER;
    
    @Column(columnDefinition = "TEXT")
    private String facilities;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HallStatus status = HallStatus.PENDING;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private Integer totalBookings = 0;
    
    @OneToMany(mappedBy = "hall", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HallImage> images;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
