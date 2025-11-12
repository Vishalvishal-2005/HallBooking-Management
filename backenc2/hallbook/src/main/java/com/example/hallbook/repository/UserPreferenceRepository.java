
// File: repository/UserPreferenceRepository.java
package com.example.hallbook.repository;

import com.example.hallbook.entity.User;
import com.example.hallbook.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    Optional<UserPreference> findByUser(User user);
    Optional<UserPreference> findByUserId(Long userId);
}
