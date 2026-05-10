package com.example.hrms.dto;

public class ApplicationDTO {
    private static int counter = 1;

    private int id;
    private String name;
    private String email;
    private String role;
    private String experience;
    private String resumeUrl;
    private String status = "Pending";

    public ApplicationDTO() {}

    public ApplicationDTO(String name, String email, String role, String experience, String resumeUrl) {
        this.id = counter++;
        this.name = name;
        this.email = email;
        this.role = role;
        this.experience = experience;
        this.resumeUrl = resumeUrl;
        this.status = "Pending";
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
