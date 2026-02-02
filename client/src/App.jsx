// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// ---------------- USER ----------------
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./page/User/HomePage";
import AboutPage from "./page/User/AboutPage";
import ContactPage from "./page/User/ContactPage";
import CustomerList from "./page/User/CustomerListPage";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import OTP from "./components/OTP";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOTP from "./components/verify-otp";
import ResetPassword from "./components/ResetPassword";
import Profile from "./page/User/Profile";  

// ---------------- ADMIN ----------------
import AdminHeader from "./components/Admin/AdminHeader";
import AdminFooter from "./components/Admin/AdminFooter";
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminDashboard from "./page/Admin/AdminDashboard";
import AdminAboutPage from "./page/Admin/AdminAbout";
import AdminCustomerList from "./page/Admin/AdminCustomerList";
// import AdminUsers from "./page/Admin/AdminUsers";
import AdminCategories from "./page/Admin/AdminCategories";
import AddCustomer from "./page/Admin/AddCustomer";

// ---------------- SUPER ADMIN ----------------
import SuperAdminHeader from "./components/SuperAdmin/SuperAdminHeader";
import SuperAdminSidebar from "./components/SuperAdmin/SuperAdminSidebar";
import SuperAdminDashboard from "./page/SuperAdmin/SuperAdminDashboard";
import SuperAdminUsers from "./page/SuperAdmin/SuperAdminUsers";
import SuperAdminCustomerList from "./page/SuperAdmin/SuperAdminCustomerList";

// ---------------- LAYOUTS ----------------

// User Layout
const UserLayout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

// Admin Layout
const AdminLayout = ({ children }) => (
  <div className="d-flex min-vh-100">
    <AdminSidebar />
    <div className="flex-grow-1">
      <AdminHeader />
      <main className="p-3">{children}</main>
      <AdminFooter />
    </div>
  </div>
);

// SuperAdmin Layout
const SuperAdminLayout = ({ children }) => (
  <div className="d-flex min-vh-100">
    <SuperAdminSidebar />
    <div className="flex-grow-1">
      <SuperAdminHeader />
      <main className="p-3">{children}</main>
    </div>
  </div>
);

// ---------------- ROUTES ----------------
const App = () => (
  <Router>
    <Routes>
      {/* ---------------- USER ROUTES ---------------- */}
      <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/about" element={<UserLayout><AboutPage /></UserLayout>} />
      <Route path="/contact" element={<UserLayout><ContactPage /></UserLayout>} />
      <Route path="/customers" element={<UserLayout><CustomerList /></UserLayout>} />
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
      <Route path="/otp" element={<UserLayout><OTP /></UserLayout>} />
      <Route path="/verify-otp" element={<UserLayout><VerifyOTP /></UserLayout>} />
      <Route path="/forgot-password" element={<UserLayout><ForgotPassword /></UserLayout>} />
      <Route path="/reset-password" element={<UserLayout><ResetPassword /></UserLayout>} />
      <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />

      {/* ---------------- ADMIN ROUTES ---------------- */}
      <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/about" element={<AdminLayout><AdminAboutPage /></AdminLayout>} />
      {/* <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} /> */}
      <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
      <Route path="/admin/customers" element={<AdminLayout><AdminCustomerList /></AdminLayout>} />
      <Route path="/admin/customers/add" element={<AdminLayout><AddCustomer /></AdminLayout>} />
      <Route path="/admin/customers/edit/:id" element={<AdminLayout><AddCustomer /></AdminLayout>} />

      {/* ---------------- SUPER ADMIN ROUTES ---------------- */}
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/superadmin/users" element={<SuperAdminUsers />} />
      <Route path="/superadmin/customers" element={<SuperAdminCustomerList />} />
      
      {/* Add more SuperAdmin routes here as needed */}
    </Routes>
  </Router>
);

export default App;
