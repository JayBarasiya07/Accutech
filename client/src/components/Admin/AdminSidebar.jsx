import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove all stored user info
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("activeRole");

    // Navigate to login
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle btn btn-primary d-lg-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", top: 10, left: 10, zIndex: 1100 }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header mb-4">
          {/* Logo + App Name */}
         
          <span>Accutech</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Dashboard
          </NavLink>

          <NavLink 
            to="/admin/customers" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Customers
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Users
          </NavLink>

          <NavLink 
            to="/admin/about" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            About Page
          </NavLink>

          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Categories
          </NavLink>

          {/* Logout button */}
          <button 
            className="btn btn-danger w-100 mt-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
