
// File: repository/HallImageRepository.java
package com.example.hallbook.repository;

import com.example.hallbook.entity.Hall;
import com.example.hallbook.entity.HallImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HallImageRepository extends JpaRepository<HallImage, Long> {
    List<HallImage> findByHall(Hall hall);
    List<HallImage> findByHallId(Long hallId);
    Optional<HallImage> findByHallAndIsPrimaryTrue(Hall hall);
    void deleteByHallId(Long hallId);
}
