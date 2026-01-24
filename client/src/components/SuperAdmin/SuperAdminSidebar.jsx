// src/components/SuperAdmin/SuperAdminSidebar.jsx
import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaCogs, FaSignOutAlt } from "react-icons/fa";
import "./SuperAdminSidebar.css";

const SuperAdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/superadmin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/superadmin/users", label: "Manage Users", icon: <FaUsers /> },
    { path: "/superadmin/settings", label: "Settings", icon: <FaCogs /> },
    // Add more links here
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="superadmin-sidebar bg-dark text-light d-flex flex-column">
      <h5 className="text-center py-3 border-bottom">Accutech</h5>
      <Nav className="flex-column mt-3">
        {navLinks.map((link) => (
          <Nav.Link
            key={link.path}
            className={`text-light d-flex align-items-center ${
              location.pathname === link.path ? "active-link" : ""
            }`}
            onClick={() => navigate(link.path)}
          >
            <span className="me-2">{link.icon}</span>
            {link.label}
          </Nav.Link>
        ))}
        <Nav.Link
          className="text-danger d-flex align-items-center mt-auto"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SuperAdminSidebar;
