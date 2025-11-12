package com.example.hallbook.controller;

import com.example.hallbook.entity.Hall;
import com.example.hallbook.service.HallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
@RequiredArgsConstructor
public class HallController {
    private final HallService hallService;

    @PostMapping
    /**
     * Creates a new hall and returns the saved hall entity.
     */
    public ResponseEntity<Hall> createHall(@RequestBody Hall hall) {
        return ResponseEntity.ok(hallService.saveHall(hall));
    }

    @GetMapping
    /**
     * Retrieves a list of all halls.
     */
    public ResponseEntity<List<Hall>> getAll() {
        return ResponseEntity.ok(hallService.getAllHalls());
    }

    @GetMapping("/city/{city}")
    /**
     * Retrieves a list of halls located in the specified city.
     */
    public ResponseEntity<List<Hall>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(hallService.getHallsByCity(city));
    }
}
