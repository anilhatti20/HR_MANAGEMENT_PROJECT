package com.example.hrms.controller;

import com.example.hrms.entity.PersonalUpdateRequest;
import com.example.hrms.entity.User;
import com.example.hrms.repository.PersonalUpdateRequestRepository;
import com.example.hrms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonalUpdateController {

    @Autowired
    private PersonalUpdateRequestRepository updateRequestRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/update")
    public ResponseEntity<String> submitUpdateRequest(@RequestBody PersonalUpdateRequest request) {
        try {
            request.setStatus("Pending");
            request.setSubmittedAt(LocalDateTime.now());
            updateRequestRepo.save(request);
            return ResponseEntity.ok("Update request submitted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save request");
        }
    }

    @GetMapping("/pending")
    public List<PersonalUpdateRequest> getPendingRequests() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("➡ Authenticated user: " + auth.getName());
        System.out.println("➡ Authorities: " + auth.getAuthorities());

        return updateRequestRepo.findByStatus("Pending");
    }

    @PostMapping("/decide/{requestId}")
    public ResponseEntity<String> processRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> body 
    ) {
        String decision = body.get("decision");

        Optional<PersonalUpdateRequest> optionalRequest = updateRequestRepo.findById(requestId);

        if (optionalRequest.isPresent()) {
            PersonalUpdateRequest request = optionalRequest.get();
            request.setStatus(decision);
            updateRequestRepo.save(request);

            if ("Approved".equalsIgnoreCase(decision)) {
                Optional<User> userOptional = userRepo.findById(request.getUserId());
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    user.setFullName(request.getFullName());
                    user.setPhoneNumber(request.getPhoneNumber());
                    user.setEmail(request.getEmail());
                    userRepo.save(user);
                }
            }

            return ResponseEntity.ok("Request " + decision);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");
        }
    }

    @GetMapping("/user/{userId}")
    public List<PersonalUpdateRequest> getRequestsByUser(@PathVariable Long userId) {
        return updateRequestRepo.findByUserId(userId);
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getStatusByEmail(@RequestParam String email) {
        List<PersonalUpdateRequest> requests = updateRequestRepo.findByEmailOrderBySubmittedAtDesc(email);
        if (requests.isEmpty()) {
            return ResponseEntity.ok(Map.of("status", "No Requests"));
        }
        return ResponseEntity.ok(Map.of("status", requests.get(0).getStatus()));
    }
}
