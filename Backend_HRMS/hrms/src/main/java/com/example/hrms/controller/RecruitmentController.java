package com.example.hrms.controller;

import com.example.hrms.dto.Vacancy;
import com.example.hrms.dto.ApplicationDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RecruitmentController {

    private final List<Vacancy> vacancyList = new ArrayList<>();
    private final List<ApplicationDTO> applications = new ArrayList<>();
    private final String UPLOAD_DIR = "uploads/resumes";

    // ✅ POST: Add job vacancy
    @PostMapping("/vacancies")
    public ResponseEntity<?> addVacancy(@RequestBody Vacancy vacancy) {
        System.out.println("📥 Received vacancy: " + vacancy.getRole());
        vacancy.setId(vacancyList.size() + 1); // assign simple ID
        vacancyList.add(vacancy);
        return ResponseEntity.ok("✅ Vacancy added");
    }

    // ✅ GET: All vacancies
    @GetMapping("/vacancies")
    public List<Vacancy> getVacancies() {
        return vacancyList;
    }

    // ✅ POST: Apply with resume
    @PostMapping("/applications")
    public ResponseEntity<?> apply(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String experience,
            @RequestParam String role,
            @RequestParam String jobId, // optional
            @RequestParam("resume") MultipartFile file) {

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + "/" + fileName;
            file.transferTo(new File(filePath));

            String resumeUrl = "/downloads/resumes/" + fileName;

            ApplicationDTO app = new ApplicationDTO(name, email, role, experience, resumeUrl);
            applications.add(app);

            System.out.println("✅ Application received from: " + name);
            return ResponseEntity.ok("✅ Application submitted");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Upload failed");
        }
    }

    // ✅ GET: View all job applications
    @GetMapping("/applications")
    public List<ApplicationDTO> getApplications() {
        return applications;
    }

    // ✅ PUT: Update application status
    @PutMapping("/applications/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestBody Map<String, String> body) {
        String status = body.get("status");

        for (ApplicationDTO app : applications) {
            if (app.getId() == id) {
                app.setStatus(status);
                return ResponseEntity.ok("✅ Status updated");
            }
        }

        return ResponseEntity.badRequest().body("❌ Application not found");
    }
}
