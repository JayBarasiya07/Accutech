import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./page/User/HomePage";
import AboutPage from "./page/User/AboutPage";
import ContactPage from "./page/User/ContactPage";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import CustomerList from "./page/User/CustomerListPage";
import OTP from "./components/OTP";
import ForgotPassword from "./components/ForgotPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // <-- include custom CSS


// ADMIN PAGES
import AdminDashboard from "./page/Admin/AdminDashboard";
import AdminAboutPage from "./page/Admin/AdminAbout";



const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
           

          </Routes>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
          
            <Route path="/about" element={<AdminAboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
