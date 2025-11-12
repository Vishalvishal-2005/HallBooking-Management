package com.example.hallbook.repository;

import com.example.hallbook.entity.Notification;
import com.example.hallbook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
}
