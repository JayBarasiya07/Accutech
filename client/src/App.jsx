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
import './App.css';

// ADMIN
import AdminHeader from "./components/Admin/AdminHeader";
import AdminFooter from "./components/Admin/AdminFooter";
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminDashboard from "./page/Admin/AdminDashboard";
import AdminAboutPage from "./page/Admin/AdminAbout";
import AdminCustomerList from "./page/Admin/AdminCustomerList";
import AdminUsers from "./page/Admin/AdminUsers"; 
import AdminCategories from "./page/Admin/AdminCategories";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminHeader />
        <main className="p-3">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>

        {/* USER ROUTES */}
        <Route
          path="/*"
          element={
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
              </main>
              <Footer />
            </div>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <AdminLayout>
              <AdminCustomerList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/about"
          element={
            <AdminLayout>
              <AdminAboutPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
          <AdminLayout>
           <AdminUsers />
          </AdminLayout>
          }
      />
        <Route
          path="/admin/categories"
          element={
          <AdminLayout>
           <AdminCategories />
          </AdminLayout>
          }
      />

      </Routes>
    </Router>
  );
};

export default App;
