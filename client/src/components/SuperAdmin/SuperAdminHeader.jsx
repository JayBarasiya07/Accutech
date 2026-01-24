// src/components/SuperAdmin/SuperAdminHeader.jsx
import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserCircle } from "react-icons/fa";

const SuperAdminHeader = () => {
  const navigate = useNavigate();

  // Get admin info from localStorage (you can store name/email on login)
  const admin = JSON.parse(localStorage.getItem("user")) || { name: "Admin", email: "" };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container>
        <Navbar.Brand href="#">Accutech</Navbar.Brand>
        <Nav className="ms-auto">
         <NavDropdown title={<><FaUserCircle className="me-1" /> {admin.name}</>} id="superadmin-dropdown" align="end">

            <NavDropdown.Item disabled>
              <strong>{admin.name}</strong>
              <br />
              <small className="text-muted">{admin.email}</small>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout} className="text-danger">
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default SuperAdminHeader;
