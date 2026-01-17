import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle btn btn-primary d-lg-none"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", top: 10, left: 10, zIndex: 1100 }}
      >
        ☰
      </button>

      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header mb-4">Accutech</div>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        <NavLink to="/admin/customers" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Customers</NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Users</NavLink>
        <NavLink to="/admin/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About Page</NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Categories</NavLink>
      </div>
    </>
  );
};

export default AdminSidebar;
