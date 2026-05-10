import React, { useState, useEffect } from "react";
import './RecruiterDashboard.css';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [vacancy, setVacancy] = useState({ role: "", experience: "" });
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  const roles = ["Software Developer", "Data Analyst", "Business Analyst", "Software Tester"];
  const experiences = ["0", "1", "2", "3", "4", "5", "6+"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVacancy(prev => ({ ...prev, [name]: value }));
  };

  const handleVacancySubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacancy),
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      setMessage("✅ Vacancy posted successfully!");
      setVacancy({ role: "", experience: "" });
    } catch (err) {
      console.error("Post error:", err);
      setMessage("❌ Failed to post vacancy.");
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Fetch applications failed:", err);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await fetch(`http://localhost:8080/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchApplications();
    } catch (err) {
      console.error("Update status failed", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="recruiter-dashboard">
      <h2>Recruiter Dashboard</h2>

      <form className="vacancy-form" onSubmit={handleVacancySubmit}>
        <h3>Post a Job</h3>

        <label>Role</label>
        <select name="role" value={vacancy.role} onChange={handleChange} required>
          <option value="">--Select Role--</option>
          {roles.map((r, i) => <option key={i} value={r}>{r}</option>)}
        </select>

        <label>Experience (Years)</label>
        <select name="experience" value={vacancy.experience} onChange={handleChange} required>
          <option value="">--Select--</option>
          {experiences.map((e, i) => <option key={i} value={e}>{e}</option>)}
        </select>

        <button type="submit">Post</button>
        {message && <p className="message">{message}</p>}
      </form>

      <h3>Applications Received</h3>
      <div className="applications">
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map(app => (
            <div key={app.id} className="application-card">
              <p><strong>Name:</strong> {app.name}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Role Applied:</strong> {app.role}</p>
              <p><strong>Experience:</strong> {app.experience} years</p>
              <a href={app.resumeUrl} target="_blank" rel="noreferrer">📄 View Resume</a>
              <div className="decision-buttons">
                <button onClick={() => handleDecision(app.id, "Accepted")}>Accept</button>
                <button onClick={() => handleDecision(app.id, "Rejected")}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="back-arrow" onClick={() => navigate(-1)}>
       	 Back
      </div>
    </div>
  );
};

export default RecruiterDashboard;
