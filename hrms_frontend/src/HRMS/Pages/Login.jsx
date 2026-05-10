import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Backend response: ", data);

      if (response.ok) {
        setMessage(`✅ Login successful! Welcome, ${data.fullName || data.email}`);

        // Save token and user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify({
          name: data.fullName,
          email: data.email,
          role: data.role
        }));

        // Role-based navigation
        const role = data.role?.toUpperCase();

        switch (role) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "HR":
            navigate("/hr/dashboard");
            break;
          case "EMPLOYEE":
            navigate("/employee/dashboard");
            break;
          case "RECRUITER":
            navigate("/recruiter/dashboard");
            break;
          case "FINANCE":
            navigate("/finance/dashboard");
            break;
          default:
            setMessage("❌ Unknown role. Access denied.");
        }
      } else {
        setMessage(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage("❌ Error logging in. Please try again.");
    }
  };

    const navigate = useNavigate();

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Sign In</h2>

        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button type="submit" className="sign-in-button">
          Sign In
        </button>

        {message && <p className="login-message">{message}</p>}
      </form>
      <div className="back-arrow" onClick={() => navigate(-1)}>
       	 Back
      </div>

    </div>
  );
}

export default Login;
