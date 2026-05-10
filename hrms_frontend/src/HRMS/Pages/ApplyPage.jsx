// src/HRMS/Pages/ApplyPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ApplyPage.css';

const ApplyPage = () => {
  const { jobId } = useParams();
  
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    resume: null,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch specific job details by ID (optional enhancement)
    fetch(`http://localhost:8080/api/jobs/${jobId}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error('Failed to fetch job:', err));
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setMessage("❌ Please upload your resume.");
      return;
    }

    const submission = new FormData();
    submission.append("name", formData.name);
    submission.append("email", formData.email);
    submission.append("experience", formData.experience);
    submission.append("resume", formData.resume);
    submission.append("jobId", jobId);
    submission.append("role", job?.role || '');

    try {
      const res = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        body: submission,
      });

      if (res.ok) {
        setMessage("✅ Application submitted successfully!");
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage("❌ Failed to submit application.");
      }
    } catch (error) {
      console.error("Error applying:", error);
      setMessage("❌ Server error while submitting.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="apply-container">
      <h2>Apply for {job?.role || 'the position'}</h2>
      <form onSubmit={handleSubmit} className="apply-form">
        <label>Full Name</label>
        <input type="text" name="name" required value={formData.name} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" required value={formData.email} onChange={handleChange} />

        <label>Experience (Years)</label>
        <input type="number" name="experience" required min="0" max="30" value={formData.experience} onChange={handleChange} />

        <label>Upload Resume (PDF only)</label>
        <input type="file" accept=".pdf" required onChange={handleFileChange} />

        <button type="submit">Submit Application</button>
        {message && <p className="message">{message}</p>}
      </form>

      <div className="back-arrow" onClick={() => navigate(-1)}>
        Back
      </div>
    </div>
  );
};

export default ApplyPage;
