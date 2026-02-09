import React, { useState, useLayoutEffect, useMemo, useTransition } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  FaChartPie, 
  FaUserFriends, 
  FaInfoCircle, 
  FaTags, 
  FaSignOutAlt, 
  FaTimes, 
  FaBars,
  FaUserShield 
} from "react-icons/fa";
import './AdminSidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve admin info from localStorage safely
  const adminInfo = useMemo(() => {
    try {
      const storedAdmin = localStorage.getItem("admin_user");
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch {
      return null;
    }
  }, []);

  // Auto-close mobile sidebar on route change
  useLayoutEffect(() => {
    startTransition(() => {
      setIsOpen(false);
    });
  }, [location, startTransition]);

  // Logout handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { to: "/admin/customers", label: "Customers", icon: <FaUserFriends /> },
    { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
    { to: "/admin/about", label: "About Page", icon: <FaInfoCircle /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header d-lg-none shadow-sm">
        <button 
          className="toggle-btn btn btn-light"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span className="mobile-brand fw-bold text-primary">Accutech</span>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay d-lg-none" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar shadow ${isOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-header border-bottom">
          <div className="brand-wrapper d-flex align-items-center">
            <div className="brand-logo-circle me-2">A</div>
            <span className="brand-text fw-bold">Accutech <small className="text-primary">Admin</small></span>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="admin-profile-section p-3 mb-2 text-center border-bottom bg-light">
          <div className="avatar-icon mx-auto mb-2">
            <FaUserShield size={28} className="text-primary" />
          </div>
          <h6 className="mb-0 fw-bold text-truncate">{adminInfo?.name || "Admin User"}</h6>
          <small className="text-muted d-block text-truncate">{adminInfo?.email || ""}</small>
          <span className="badge bg-primary mt-2" style={{ fontSize: '10px' }}>SYSTEM ADMIN</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav d-flex flex-column">
          <div className="nav-section-label px-3 py-2 small text-uppercase text-muted fw-bold">Main Menu</div>
          {navLinks.map(({ to, label, icon }) => (
            <NavLink 
              key={to}
              to={to}
              className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-text">{label}</span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <div className="mt-auto border-top p-3">
            <button 
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
