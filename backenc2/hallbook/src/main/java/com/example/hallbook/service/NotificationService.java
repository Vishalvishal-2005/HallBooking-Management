package com.example.hallbook.service;

import com.example.hallbook.entity.Notification;
import com.example.hallbook.entity.User;
import com.example.hallbook.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification send(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUser(user);
    }
}
