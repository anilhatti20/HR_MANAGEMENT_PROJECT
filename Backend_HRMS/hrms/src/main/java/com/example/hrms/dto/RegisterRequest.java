package com.example.hrms.dto;

import lombok.Data;

@Data
public class RegisterRequest {
	
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
    private String role; 
    
    
    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

}