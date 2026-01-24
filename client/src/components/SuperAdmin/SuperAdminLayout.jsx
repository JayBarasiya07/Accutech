// components/SuperAdmin/SuperAdminLayout.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminFooter from "./SuperAdminFooter";

const SuperAdminLayout = ({ children, totalUsers = 0, totalAdmins = 0, refresh }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SuperAdminHeader />
      <Row className="g-0 flex-grow-1">
        <Col md={2} className="bg-light min-vh-100 p-3">
          <SuperAdminSidebar
            totalUsers={totalUsers}
            totalAdmins={totalAdmins}
            refresh={refresh}
          />
        </Col>
        <Col md={10} className="p-4">
          {children}
          <SuperAdminFooter />
        </Col>
      </Row>
    </div>
  );
};

export default SuperAdminLayout;
