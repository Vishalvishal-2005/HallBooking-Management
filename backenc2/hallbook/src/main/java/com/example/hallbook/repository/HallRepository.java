package com.example.hallbook.repository;

import com.example.hallbook.entity.Hall;
import com.example.hallbook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HallRepository extends JpaRepository<Hall, Long> {
    List<Hall> findByCity(String city);
    List<Hall> findByOwner(User owner);
}
