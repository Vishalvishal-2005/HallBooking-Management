package com.example.hallbook.controller;

import com.example.hallbook.entity.Booking;
import com.example.hallbook.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }
}
