import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import '../../App.css';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('ALL');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setMessage('❌ Failed to load users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, );

  const handleRoleChange = async (id, newRole) => {
    try {
      await fetch(`http://localhost:8080/api/auth/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      setMessage(`✅ Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update role.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`http://localhost:8080/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      setMessage('✅ User deleted successfully.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to delete user.');
    }
  };

  const exportToExcel = () => {
    const exportData = users.map(user => ({
      ID: user.id,
      Name: user.fullName,
      Email: user.email,
      Role: user.role,
      'Registered On': user.registeredAt || '-',
      'Last Login': user.lastLogin || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'UserList.xlsx');
  };

  const filteredUsers =
  filteredRole === 'ALL'
    ? users
    : users.filter((u) => u.role?.toUpperCase() === filteredRole.toUpperCase());

    const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {message && <p className="message">{message}</p>}

      <div className="admin-controls">
        <label>Filter by Role: </label>
        <select onChange={(e) => setFilteredRole(e.target.value)} value={filteredRole}>
          <option value="ALL">All</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button onClick={exportToExcel}>📤 Export to Excel</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Registered On</th>
            <th>Last Login</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="HR">HR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>{u.registeredAt || '-'}</td>
              <td>{u.lastLogin || '-'}</td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
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

export default AdminDashboard;
