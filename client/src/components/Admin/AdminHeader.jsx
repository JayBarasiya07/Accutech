import React from "react";
import { Navbar, Container, Form, FormControl } from "react-bootstrap";

const AdminHeader = ({ onSearch }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="px-3">
      <Container fluid>
        <Navbar.Brand href="/admin/dashboard">Admin Panel</Navbar.Brand>

        <Form className="d-flex ms-auto">
          <FormControl
            type="search"
            placeholder="Search anything..."
            className="me-2"
            onChange={(e) => onSearch(e.target.value)}
          />
        </Form>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
