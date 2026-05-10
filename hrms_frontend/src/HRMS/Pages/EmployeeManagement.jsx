import React, { useEffect, useState } from 'react';
import "./EmployeeManagement.css";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    role: 'Employee',
    password: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch('http://localhost:8080/api/auth/employees', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Access denied");
        throw new Error("Failed to fetch employees");
      }

      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role !== "Employee") {
      alert("Only 'Employee' role is allowed.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const url = isEditMode
        ? `http://localhost:8080/api/auth/users/${formData.id}`
        : 'http://localhost:8080/api/auth/users';

      const method = isEditMode ? 'PUT' : 'POST';
      const bodyData = { ...formData };
      if (isEditMode) {
        delete bodyData.password; // Optional: don't send empty password
      }

      await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      await fetchEmployees();
      setFormData({ id: '', fullName: '', email: '', role: 'Employee', password: '' });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving employee:", error.message);
    }
  };

  const handleEdit = (id) => {
    const empToEdit = employees.find(emp => emp.id === id);
    if (empToEdit) {
      setFormData({
        id: empToEdit.id,
        fullName: empToEdit.fullName,
        email: empToEdit.email,
        role: empToEdit.role || 'Employee',
        password: '' // Leave blank
      });
      setIsEditMode(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/auth/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      setEmployees(employees.filter((emp) => emp.id !== id));
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      <form onSubmit={handleSubmit} className="employee-form">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
          readOnly
        />
        {!isEditMode && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {isEditMode ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>

      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>
                <button onClick={() => handleEdit(emp.id)} style={{ marginRight: "8px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
