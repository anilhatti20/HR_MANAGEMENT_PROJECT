import React, { useState } from 'react';
import './Registration.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    role: 'Employee',
  });

 
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const email = formData.email.toLowerCase();
    const role = formData.role.toUpperCase();

    // Validate email domain
    if (!email.endsWith('@excellia.com')) {
      setMessage("❌ Email must end with '@excellia.com'");
      return;
    }

    
    const username = email.split('@')[0];

    
    const roleMap = {
      EMPLOYEE: 'employee',
      HR: 'hr',
      ADMIN: 'admin',
      RECRUITER: 'recruiter',
      FINANCE: 'finance',
    };

    const expectedPart = roleMap[role];

    if (!expectedPart || !username.includes(expectedPart)) {
      setMessage(`❌ Invalid email for the selected role.\n\nMake sure the email includes:\n- 'employee' for Employee\n- 'hr' for HR\n- 'admin' for Admin\n- 'recruiter' for Recruiter\n- 'finance' for Finance`);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (response.ok) {
        setMessage("✅ Registration successful!");

       
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          password: '',
          role: 'Employee',
        });

       
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || 'Registration failed'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Error registering. Please try again.');
    }
  };

  const navigate = useNavigate();

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>

        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Create Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="role">Select Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Role --</option>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
          <option value="Admin">Admin</option>
          <option value="Recruiter">Recruiter</option>
          <option value="Finance">Finance</option>
        </select>

        <button type="submit" className="register-button">
          Register
        </button>

        {message && <p className="register-message">{message}</p>}
      </form>

      <div className="back-arrow" onClick={() => navigate(-1)}>
       	 Back
      </div>
    </div>
  );
};

export default Registration;
