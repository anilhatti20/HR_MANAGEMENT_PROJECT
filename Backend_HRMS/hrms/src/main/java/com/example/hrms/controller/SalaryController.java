package com.example.hrms.controller;

import com.example.hrms.dto.Salary;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/salaries")
@CrossOrigin(origins = "http://localhost:3000") // your React frontend
public class SalaryController {

    private final Map<String, Salary> salaryMap = new HashMap<>();

    @GetMapping
    public List<Salary> getAllSalaries() {
        return new ArrayList<>(salaryMap.values());
    }

    @PostMapping("/update")
    public String updateSalaries(@RequestBody List<Salary> salaryList) {
        for (Salary salary : salaryList) {
            if (salary.getEmail() != null && !salary.getEmail().isEmpty()) {
                salaryMap.put(salary.getEmail(), salary);
            }
        }
        return "Updated";
    }

}
