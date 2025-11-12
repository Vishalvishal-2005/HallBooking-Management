package com.example.hallbook.controller;

import com.example.hallbook.entity.Notification;
import com.example.hallbook.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> send(@RequestBody Notification notification) {
        return ResponseEntity.ok(notificationService.send(notification));
    }
}
