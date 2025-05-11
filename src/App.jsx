// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ChangePassword from "./Pages/ChangePassword";
import AdminDashboard from "./Pages/AdminDashboard";
import UpdateUser from "./Pages/UpdateUser";
import Transaction from "./Pages/Transaction";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/update-user/:accountNumber" element={<UpdateUser />} />
        <Route path="/transactions/:accountNumber" element={<Transaction />} />
      </Routes>
    </Router>
  );
};

export default App;
