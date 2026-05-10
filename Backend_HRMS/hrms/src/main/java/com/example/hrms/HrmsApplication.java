package com.example.hrms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication


public class HrmsApplication {
	public static void main(String[] args) {
		SpringApplication.run(HrmsApplication.class, args);
		System.out.println("HR Management System");
	}

}
