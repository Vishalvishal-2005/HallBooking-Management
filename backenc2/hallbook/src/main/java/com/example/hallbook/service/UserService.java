package com.example.hallbook.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hallbook.entity.User;
import com.example.hallbook.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }
}
