import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../assets/css/Dashboard.css'; // You can style the dashboard layout


const Dashboard = () => {
  return (
    <div className="dashboard-container">
     
      <div className="dashboard-layout">
        
        <div className="dashboard-content">
          <Routes>
            
            <Route path="/" element={<h2>Welcome to your Dashboard</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
