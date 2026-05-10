package com.example.hrms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hrms.dto.LoginRequest;
import com.example.hrms.dto.RegisterRequest;
import com.example.hrms.entity.User;
import com.example.hrms.repository.UserRepository;
import com.example.hrms.security.JwtUtil;

@Service
public class AuthService implements IAuthService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
	@Autowired
    private JwtUtil jwtUtil;

	@Override
    public void registerUser(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("User already exists with this email");
          
        }

        User user = new User();

        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());


	        userRepository.save(user);
	    }
    

    @Override
    public String loginUser(LoginRequest loginRequest) {
        
    	Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found.Please register first.");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException( "Invalid credentials ,Please check your password or email.");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }


    @Override
    public List<User> getAllEmployees() {
        return userRepository.findByRole("EMPLOYEE"); 
    }

}
