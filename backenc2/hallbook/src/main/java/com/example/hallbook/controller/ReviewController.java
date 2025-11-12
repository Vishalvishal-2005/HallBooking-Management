package com.example.hallbook.controller;

import com.example.hallbook.entity.Review;
import com.example.hallbook.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> add(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }
}
