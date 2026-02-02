import React from "react";
import { Navbar, Container, Form, FormControl, Image } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const AdminHeader = ({ onSearch }) => {
  // Get admin info from localStorage
  const admin = JSON.parse(localStorage.getItem("user")) || { name: "Admin", email: "" };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="px-3">
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand href="/admin/dashboard">Accutech</Navbar.Brand>

        {/* Search bar */}
        <Form className="d-flex ms-auto me-3">
          <FormControl
            type="search"
            placeholder="Search anything..."
            className="me-2"
            onChange={(e) => onSearch(e.target.value)}
          />
        </Form>

        {/* Admin info with avatar */}
        <div className="d-flex align-items-center text-white">
          {/* Profile avatar */}
          {admin.avatar ? (
            <Image 
              src={admin.avatar} 
              roundedCircle 
              width={40} 
              height={40} 
              className="me-2"
            />
          ) : (
            <FaUserCircle size={40} className="me-2" />
          )}

          {/* Name and email */}
          <div className="d-flex flex-column" style={{ lineHeight: 1 }}>
            <span style={{ fontWeight: "bold" }}>{admin.name}</span>
            <span style={{ fontSize: "0.8rem" }}>{admin.email}</span>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
