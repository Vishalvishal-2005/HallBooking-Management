package com.example.hallbook.repository;

import com.example.hallbook.entity.Review;
import com.example.hallbook.entity.Hall;
import com.example.hallbook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHall(Hall hall);
    List<Review> findByUser(User user);
}
