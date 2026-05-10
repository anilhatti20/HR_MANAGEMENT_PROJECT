package com.example.hrms.dto;

public class Vacancy {
    private int id;
    private String role;
    private String experience;

    public Vacancy() {}

    public Vacancy(int id, String role, String experience) {
        this.id = id;
        this.role = role;
        this.experience = experience;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
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
}
