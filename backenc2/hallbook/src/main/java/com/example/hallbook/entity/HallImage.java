
// File: entity/HallImage.java
package com.example.hallbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "hall_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HallImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hall_id", nullable = false)
    private Hall hall;
    
    @Column(nullable = false, length = 500)
    private String imageUrl;
    
    @Column(nullable = false)
    private Boolean isPrimary = false;
    
    @Column(columnDefinition = "TEXT")
    private String aiTags;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;
}
