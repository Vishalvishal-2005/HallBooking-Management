package com.example.hallbook.controller;

import com.example.hallbook.entity.User;
import com.example.hallbook.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String email, @RequestParam String password) {
        return userService.login(email, password)
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.badRequest().body("Invalid credentials"));
    }
}
