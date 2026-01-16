import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const AdminHeader = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/admin">Admin Panel</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
