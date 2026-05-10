import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDashboard.css';
import '../../App.css';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('leave');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [salaryInfo, setSalaryInfo] = useState({});
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [personalStatus, setPersonalStatus] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

    if (!currentUser.email) return;

    fetch(`http://localhost:8080/api/auth/user?email=${currentUser.email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);

        fetch(`http://localhost:8080/api/personal/status?email=${data.email}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then(res => res.json())
          .then(data => setPersonalStatus(data.status))
          .catch(err => console.error("Failed to load update status", err));

        fetch("http://localhost:8080/api/salaries")
          .then(res => res.json())
          .then(salaries => {
            const record = salaries.find(s => s.email === data.email);
            if (record) setSalaryInfo(record);
            else console.warn("No salary record for", data.email);
          })
          .catch(err => console.error("Failed to load salary", err));
      })
      .catch(err => console.error("Failed to load user details", err));

    const requests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    setSubmittedRequests(requests.filter(r => r.email === currentUser.email));

    const today = new Date().toLocaleDateString();
    const attendance = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    setAttendanceMarked(!!(attendance[currentUser.email] && attendance[currentUser.email][today]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      email: user.email,
      name: user.fullName,
      date: leaveDate,
      reason: leaveReason,
      submittedAt: new Date().toLocaleString(),
      status: 'Pending'
    };
    const all = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const updated = [...all, newRequest];
    localStorage.setItem('leaveRequests', JSON.stringify(updated));
    setSubmittedRequests(updated.filter(r => r.email === user.email));
    setLeaveDate('');
    setLeaveReason('');
    alert('Leave Request Sent!');
  };

  const markAttendance = () => {
    const today = new Date().toLocaleDateString();
    const attendance = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    if (!attendance[user.email]) attendance[user.email] = {};
    attendance[user.email][today] = new Date().toLocaleTimeString();
    localStorage.setItem('attendanceRecords', JSON.stringify(attendance));
    setAttendanceMarked(true);
  };

  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const updateRequest = {
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
    };

    try {
      const res = await fetch("http://localhost:8080/api/personal/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateRequest)
      });

      if (res.ok) {
        setMessage("✅ Update request sent to HR for approval!");
        setPersonalStatus("Pending");
      } else {
        setMessage("❌ Failed to send update request");
      }
    } catch (err) {
      console.error("Error submitting personal update:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="employee-dashboard">
      <div className="user-info">
        Logged in as:<br />
        <small>{user.email || 'No Email'}</small>
      </div>

      <h1>Employee Dashboard</h1>

      <div className="tabs">
        <button className={activeTab === 'leave' ? 'active' : ''} onClick={() => setActiveTab('leave')}>Leave Request</button>
        <button className={activeTab === 'salary' ? 'active' : ''} onClick={() => setActiveTab('salary')}>Salary Details</button>
        <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => setActiveTab('personal')}>Personal Details</button>
      </div>

      {message && <p className="update-message">{message}</p>}

      {activeTab === 'leave' && (
        <>
          <form onSubmit={handleSubmit}>
            <label>Leave Date:
              <input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
            </label>
            <label>Reason:
              <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
            </label>
            <button type="submit">Submit</button>
          </form>

          <div className="section">
            <h2>My Leave Requests</h2>
            <ul>
              {submittedRequests.map((req, i) => (
                <li key={i}>{req.date} - {req.reason} - <em>{req.status}</em></li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Attendance</h2>
            {attendanceMarked ? (
              <p className="marked">✅ Marked today</p>
            ) : (
              <button onClick={markAttendance}>Mark Attendance</button>
            )}
          </div>
        </>
      )}

      {activeTab === 'salary' && (
        <div className="section">
          <h2>My Salary</h2>
          {salaryInfo && salaryInfo.salary ? (
            <table>
              <thead><tr><th>Salary</th><th>HR Note</th></tr></thead>
              <tbody><tr>
                <td>{salaryInfo.salary}</td>
                <td>{salaryInfo.message || '—'}</td>
              </tr></tbody>
            </table>
          ) : (
            <p>No salary record found.</p>
          )}
        </div>
      )}

      {activeTab === 'personal' && (
        <div className="section">
          <h2>Personal Details</h2>
          <form onSubmit={handlePersonalUpdate}>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>
                    <input
                      type="text"
                      value={user.fullName || ''}
                      onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    <input
                      type="email"
                      value={user.email || ''}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>
                    <input
                      type="tel"
                      value={user.phoneNumber || ''}
                      onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit">Submit Update Request</button>
          </form>
          {personalStatus && (
            <p className="status-indicator">Status: <strong>{personalStatus}</strong></p>
          )}
        </div>
      )}

      <div className="back-arrow" onClick={() => navigate(-1)}>
        Back
      </div>
    </div>
  );
};

export default EmployeeDashboard;
