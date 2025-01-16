// src/App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFoud";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import VisitTable from "./pages/VisitTable";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("user") // Check if user data exists in localStorage
  );

  // Private Route Component
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
  path="/login"
  element={<Login setIsAuthenticated={setIsAuthenticated} />}
/>


        {/* Private Routes with Layout */}
        <Route
          path="/*" // Use "/*" to allow nested routing inside the layout
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} /> {/* Add the Dashboard route */}
                  <Route path="/employees" element={<Employee />} />
                  <Route path="/guest-list" element={<VisitTable />} />
                  {/* You can add more nested routes here */}
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
