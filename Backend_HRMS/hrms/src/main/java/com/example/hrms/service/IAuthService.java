package com.example.hrms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.hrms.dto.LoginRequest;
import com.example.hrms.dto.RegisterRequest;
import com.example.hrms.entity.User;

//Interface
public interface IAuthService {
	
 void registerUser(RegisterRequest registerRequest);
 
 String loginUser(LoginRequest loginRequest);
 
 
 List<User> getAllEmployees();
 
 
}

