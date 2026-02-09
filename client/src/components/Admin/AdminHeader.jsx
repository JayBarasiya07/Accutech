import React, { useState } from "react";
import { Navbar, Container, FormControl, InputGroup, Button, Image } from "react-bootstrap";
import { FaUserCircle, FaSearch, FaBars } from "react-icons/fa";
import './AdminSidebar.css'; // Reuse dashboard CSS

const AdminHeader = ({ onSearch, toggleSidebar }) => {
  const admin = JSON.parse(localStorage.getItem("user")) || { name: "Admin", email: "admin@accutech.com", avatar: null };
  const [searchVal, setSearchVal] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchVal(value);
    onSearch(value); // Call parent search function
  };

  return (
    <Navbar sticky="top" className="admin-header-top px-4 shadow-sm">
      <Container fluid className="d-flex align-items-center justify-content-between p-0">

        {/* Mobile Sidebar Toggle */}
        <Button variant="light" className="d-lg-none me-2" onClick={toggleSidebar}>
          <FaBars />
        </Button>

        {/* Brand */}
        <Navbar.Brand href="/admin/dashboard" className="text-primary fw-bold d-flex align-items-center" style={{ fontSize: '1.5rem' }}>
          Accutech
        </Navbar.Brand>

        {/* Search Bar */}
        <div className="d-none d-md-block flex-grow-1 mx-3">
          <InputGroup 
            className={`glass-input-group shadow-sm ${focused ? "focused" : ""}`} 
            style={{ transition: "all 0.3s ease" }}
          >
            <InputGroup.Text className="search-icon-box bg-white text-primary">
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              type="search"
              placeholder="Quick search..."
              value={searchVal}
              onChange={handleSearchChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="glass-search-input"
              style={{
                transition: "width 0.3s ease",
                width: focused ? "320px" : "220px"
              }}
            />
          </InputGroup>
        </div>

        {/* Admin Profile */}
        <div className="admin-profile d-flex align-items-center text-dark position-relative">
          {admin.avatar ? (
            <Image src={admin.avatar} roundedCircle className="avatar shadow-sm" />
          ) : (
            <div className="avatar avatar-gradient shadow-sm">{admin.name.charAt(0)}</div>
          )}
          <div className="online-indicator"></div>
          <div className="admin-text-info d-none d-sm-flex flex-column ms-2">
            <span className="fw-bold">{admin.name}</span>
            <span className="small text-muted">{admin.email}</span>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
