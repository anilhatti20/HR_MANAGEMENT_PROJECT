package com.example.hrms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrms.entity.PersonalUpdateRequest;

public interface PersonalUpdateRequestRepository extends JpaRepository<PersonalUpdateRequest, Long> {
    List<PersonalUpdateRequest> findByStatus(String status);
    List<PersonalUpdateRequest> findByUserId(Long userId);
    List<PersonalUpdateRequest> findByEmailOrderBySubmittedAtDesc(String email);
}
