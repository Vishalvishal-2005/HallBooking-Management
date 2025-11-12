package com.example.hallbook.service;

import com.example.hallbook.entity.Hall;
import com.example.hallbook.entity.User;
import com.example.hallbook.repository.HallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HallService {
    private final HallRepository hallRepository;

    public Hall saveHall(Hall hall) {
        return hallRepository.save(hall);
    }

    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    public List<Hall> getHallsByCity(String city) {
        return hallRepository.findByCity(city);
    }

    public List<Hall> getHallsByOwner(User owner) {
        return hallRepository.findByOwner(owner);
    }
}
