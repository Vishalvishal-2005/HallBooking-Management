package com.example.hallbook.repository;

import com.example.hallbook.entity.Booking;
import com.example.hallbook.entity.User;
import com.example.hallbook.entity.Hall;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByHall(Hall hall);
}
