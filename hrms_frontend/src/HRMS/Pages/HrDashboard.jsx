import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HrDashboard.css';
import '../../App.css';
import EmployeeManagement from './EmployeeManagement';
import { useNavigate } from 'react-router-dom';

const HrDashboard = () => {
  const [activeTab, setActiveTab] = useState('employee');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [salaryData, setSalaryData] = useState([]);
  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {
      name: 'HR Admin',
      email: 'hr@example.com'
    };
    setLoggedInUser(user);

    const savedLeaves = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    setLeaveRequests(savedLeaves);

    const savedAttendance = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    setAttendanceData(savedAttendance);

    const token = localStorage.getItem("token");
    axios.get("http://localhost:8080/api/auth/employees", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(empRes => {
      axios.get("http://localhost:8080/api/salaries")
        .then(salRes => {
          const salaryMap = new Map();
          salRes.data.forEach(s => salaryMap.set(s.email, s));

          const merged = empRes.data.map(emp => {
            const salaryInfo = salaryMap.get(emp.email) || { salary: '', message: '' };
            return {
              name: emp.fullName,
              email: emp.email,
              ...salaryInfo
            };
          });

          setSalaryData(merged);
        })
        .catch(err => {
          console.error("Error fetching salary data", err);
        });
    }).catch(err => console.error("Error fetching employee/salary data", err));

    axios.get("http://localhost:8080/api/personal/pending", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPendingUpdates(res.data))
    .catch(err => {
      console.error("Error fetching pending updates", err);
      setMessage("❌ Failed to fetch updates");
    });
  }, []);

  const updateSalary = (index, field, value) => {
    const updated = [...salaryData];
    updated[index][field] = value;
    setSalaryData(updated);
  };

  const saveSalary = () => {
    axios.post("http://localhost:8080/api/salaries/update", salaryData)
      .then(() => alert('✅ Salary records updated!'))
      .catch(() => alert('❌ Failed to update salary records'));
  };

  const handleDecision = (index, status) => {
    const updated = [...leaveRequests];
    updated[index].status = status;
    localStorage.setItem('leaveRequests', JSON.stringify(updated));
    setLeaveRequests(updated);
  };

  const handleUpdateDecision = (id, isApproved) => {
  const token = localStorage.getItem("token");
  axios.post(
    `http://localhost:8080/api/personal/decide/${id}?decision=${isApproved ? 'Approved' : 'Rejected'}`,
    {}, // body
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
  .then(res => {
    // OPTIONAL: check if res.data exists
    console.log("Update success", res.data);
    setPendingUpdates(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: isApproved ? 'Approved' : 'Rejected' } : req
      )
    );
    setMessage(`✅ Update ${isApproved ? 'approved' : 'rejected'} successfully.`);
  })
  .catch((err) => {
    console.error("Failed to load update status", err);
    setMessage("❌ Failed to update request status");
  });
};
  const renderContent = () => {
    switch (activeTab) {
      case 'employee':
        return <EmployeeManagement />;
      case 'leave':
        return (
          <div className="card">
            <h2>Leave Requests</h2>
            <ul>
              {leaveRequests.map((req, index) => (
                <li key={index}>
                  <strong>{req.name} ({req.email})</strong><br />
                  {req.date} - {req.reason} - <em>{req.status}</em>
                  {req.status === 'Pending' && (
                    <>
                      <button onClick={() => handleDecision(index, 'Approved')}>Approve</button>
                      <button onClick={() => handleDecision(index, 'Rejected')}>Reject</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'attendance':
        return (
          <div className="card">
            <h2>Attendance Records</h2>
            {Object.entries(attendanceData).map(([email, days]) => (
              <div key={email}>
                <strong>{email}</strong>
                <ul>
                  {Object.entries(days).map(([date, time]) => (
                    <li key={date}>{date} - {time}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'salary':
        return (
          <div className="card">
            <h2>Salary Management</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>
                      <input
                        type="text"
                        value={emp.salary}
                        onChange={(e) => updateSalary(index, 'salary', e.target.value)}
                      />
                    </td>
                    <td>
                      <textarea
                        rows="2"
                        value={emp.message || ''}
                        onChange={(e) => updateSalary(index, 'message', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="save-salary-btn" onClick={saveSalary}>Save Salary Records</button>
          </div>
        );
      case 'personalUpdates':
        return (
          <div className="card">
            <h2>Personal Details of Employees</h2>
            {message && <p>{message}</p>}
            {pendingUpdates.length === 0 ? (
              <p>No pending updates.</p>
            ) : (
              <ul>
                {pendingUpdates.map((update, index) => (
                  <li key={index}>
                    <strong>{update.email}</strong><br />
                    Name: <b>{update.fullName}</b><br />
                    Phone Number: <b>{update.phoneNumber}</b><br />
                    Status: <em>{update.status}</em><br /><br />
                    <button onClick={() => handleUpdateDecision(update.id, true)}>Approve</button>
                    <button onClick={() => handleUpdateDecision(update.id, false)}>Reject</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="hr-dashboard">
      <div className="sidebar">
        <div className="user-info">
          <strong>{loggedInUser.name}</strong><br />
          <small>{loggedInUser.email}</small>
        </div>
        <ul>
          <li onClick={() => setActiveTab('employee')}>Employee Management</li>
          <li onClick={() => setActiveTab('leave')}>Leave Requests</li>
          <li onClick={() => setActiveTab('attendance')}>Attendance</li>
          <li onClick={() => setActiveTab('salary')}>Salary</li>
          <li onClick={() => setActiveTab('personalUpdates')}>Personal Updates</li>
        </ul>
      </div>
      <div className="hr-content">
        <h1>HR Dashboard</h1>
        {renderContent()}
      </div>
      <div className="back-arrow" onClick={() => navigate(-1)}>
        Back
      </div>
    </div>
  );
};

export default HrDashboard;
