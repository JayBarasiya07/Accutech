import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  FaChartPie, 
  FaUserFriends, 
  FaInfoCircle, 
  FaTags, 
  FaSignOutAlt, 
  FaTimes, 
  FaBars 
} from "react-icons/fa";
import './AdminSidebar.css';

/**
 * AdminSidebar Component
 * 
 * A responsive sidebar navigation component for the admin dashboard that displays
 * navigation links, admin user information, and logout functionality.
 * 
 * Features:
 * - Responsive design with mobile toggle and overlay
 * - Displays admin user information (ID, Name, Email) from localStorage
 * - Navigation links to dashboard, customers, categories, and about pages
 * - Automatic sidebar closure on route changes for better mobile UX
 * - Logout functionality with confirmation dialog
 * - Accessibility support with ARIA labels
 * 
 * @component
 * @returns {JSX.Element} The rendered admin sidebar with mobile header, overlay, 
 *                        sidebar navigation, admin info, and logout button
 * 
 * @example
 * return (
 *   <AdminSidebar />
 * )
 * 
 * @requires useState - For managing sidebar open/close state and admin info
 * @requires useEffect - For handling route change effects
 * @requires useNavigate - For programmatic navigation to login page
 * @requires useLocation - For detecting route changes
 * @requires NavLink - From react-router-dom for navigation links
 * @requires FaBars, FaTimes, FaChartPie, FaUserFriends, FaTags, FaInfoCircle, FaSignOutAlt - From react-icons/fa
 * 
 * @localStorage
 * - admin_user: Stores serialized admin user information
 * - admin_token: Authentication token (removed on logout)
 * - activeRole: Current admin role (removed on logout)
 */
const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminInfo] = useState(() => {
    const storedAdmin = localStorage.getItem("admin_user");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar automatically on route change (mobile UX)
  useEffect(() => {
    Promise.resolve().then(() => {
      setIsOpen(false);
    });
  }, [location]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("activeRole");
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
      {/* --- Mobile Header --- */}
      <div className="mobile-header d-lg-none">
        <button 
          className="toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span className="mobile-brand">Accutech</span>
      </div>

      {/* --- Overlay for mobile when sidebar is open --- */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-icon">A</div>
          <span className="brand-text">Accutech</span>
        </div>

        {/* --- Admin Info --- */}
        {adminInfo && (
          <div className="admin-info p-3 border-bottom">
            <p><strong>ID:</strong> {adminInfo._id || adminInfo.id}</p>
            <p><strong>Name:</strong> {adminInfo.name}</p>
            <p><strong>Email:</strong> {adminInfo.email}</p>
          </div>
        )}

        <nav className="sidebar-nav d-flex flex-column h-100">
          {/* --- Navigation Links --- */}
          {navLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.label}</span>
            </NavLink>
          ))}

          {/* --- Footer / Logout --- */}
          <div className="nav-footer mt-auto">
            <button 
              className="logout-btn d-flex align-items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
