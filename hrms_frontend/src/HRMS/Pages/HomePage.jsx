import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const [vacancies, setVacancies] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch('http://localhost:8080/api/vacancies')
      .then(res => res.json())
      .then(data => {
        setVacancies(data);
      })
      .catch(err => {
        console.error("❌ Error loading vacancies:", err);
        setVacancies([]); // fallback
      });
  }, []);

  const handleApply = (id) => {
    navigate(`/apply/${id}`);
  };

  


  return (
    <div className="home-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <img src={require('../assets/logo.jpg')} alt="logo" className="logo-img" />
          Excellia
        </div>

        <div className="nav-links">
          <Link to="/login"><button className="login-btn">Login</button></Link>
          <Link to="/registration"><button className="regis-btn">Registration</button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <h1>Welcome to the Human Resource Management System</h1>
        <p>Simplifying HR tasks, improving productivity, and connecting your people.</p>
      </main>

      {/* Vacancy Section */}
      <section className="job-listings">
        <h2>Available Job Vacancies</h2>
        <div className="job-cards">
          {vacancies.length === 0 ? (
            <p>No job postings available.</p>
          ) : (
            vacancies.map(vac => (
              <div key={vac.id} className="job-card">
                <h3>{vac.role}</h3>
                <p><strong>Experience:</strong> {vac.experience} years</p>
                <button onClick={() => handleApply(vac.id)}>Apply Now</button>
              </div>
            ))
          )}
        </div>
      </section>

    
    </div>
  );
}

export default HomePage;
