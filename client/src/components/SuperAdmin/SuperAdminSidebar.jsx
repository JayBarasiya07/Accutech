import React from "react";
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaUserTie, 
  FaCogs, 
  FaSignOutAlt, 
  FaChevronRight 
} from "react-icons/fa";
import "./SuperAdminSidebar.css";

const SuperAdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/superadmin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/superadmin/users", label: "Manage Users", icon: <FaUserTie /> },
    { path: "/superadmin/customers", label: "Customers", icon: <FaUsers /> },
    { path: "/superadmin/settings", label: "Settings", icon: <FaCogs /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="superadmin-sidebar shadow">
      <div className="sidebar-brand">
        <div className="brand-logo">A</div>
        <span className="brand-text">Accutech</span>
      </div>

      <div className="sidebar-content">
        <small className="text-uppercase text-muted px-4 mb-2 d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}>
          Main Menu
        </small>
        
        <Nav className="flex-column px-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Nav.Link
                key={link.path}
                className={`sidebar-item ${isActive ? "active-link" : ""}`}
                onClick={() => navigate(link.path)}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
                {isActive && <FaChevronRight className="ms-auto active-arrow" />}
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      <div className="sidebar-footer mt-auto p-3 border-top border-secondary">
        <Nav.Link className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          <span>Logout</span>
        </Nav.Link>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;