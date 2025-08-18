import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import "./index.css";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CustomerDashborad from "./pages/CustomerDashboard.jsx";
import AdminDashborad from "./pages/AdminDashboard.jsx";
import RequestService from "./pages/RequestServices.jsx";
import AuthProvider from "./Providers/AuthProvider.jsx";
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="requestService" element={<RequestService />} />
      <Route path="customer_dashboard" element={<CustomerDashborad />} />
      <Route path="admin_dashboard" element={<AdminDashborad />} />
    </Routes>
  </BrowserRouter>
  </AuthProvider>
);
