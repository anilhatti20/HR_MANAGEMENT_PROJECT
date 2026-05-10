import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FinanceDashboard.css';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [filterRole, setFilterRole] = useState('ALL');
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/api/finance/salaries", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSalaries(res.data))
      .catch(err => console.error("Failed to load salaries", err));
  }, []);

  const filtered = filterRole === 'ALL'
    ? salaries
    : salaries.filter(s => s.role === filterRole);

    const navigate = useNavigate();

  return (
    <div className="finance-dashboard">
      <div className="back-arrow" onClick={() => navigate(-1)}>← Back</div>
      <h1>Finance Dashboard</h1>

      <div className="filter-bar">
        <label>Filter by Role:</label>
        <select onChange={e => setFilterRole(e.target.value)}>
          <option value="ALL">All</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Message</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.role}</td>
              <td>₹{s.salary}</td>
              <td>{s.status}</td>
              <td>{s.message}</td>
              <td>{s.paymentDate || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="back-arrow" onClick={() => navigate(-1)}>
     	 Back
    </div>
    </div>
  );
};

export default FinanceDashboard;
