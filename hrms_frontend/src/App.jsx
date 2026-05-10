import React from 'react';
import './App.css';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import HomePage from './HRMS/Pages/HomePage';
import Login from './HRMS/Pages/Login';
import Registration from './HRMS/Pages/Registration';
import AdminDashboard from './HRMS/Pages/AdminDashboard';
import HrDashboard from './HRMS/Pages/HrDashboard';
import EmployeeDashboard from './HRMS/Pages/EmployeeDashboard';
import FinanceDashboard from './HRMS/Pages/FinanceDashboard';
import RecruiterDashboard from './HRMS/Pages/RecruiterDashboard';
import ApplyPage from './HRMS/Pages/ApplyPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/hr/dashboard" element={<HrDashboard />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/finance/dashboard" element={<FinanceDashboard />} />
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      <Route path="/apply/:jobId" element={<ApplyPage />} />
      
      <Route path="/debug" element={<pre>{JSON.stringify(localStorage.getItem("loggedInUser"))}</pre>} />
    </Routes>
  );
};

export default App;