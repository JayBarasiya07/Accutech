import React, { useState } from "react";
import { Container, Card, Row, Col, Button, Offcanvas } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminAbout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Placeholder functions for future database operations
  const handleInsert = (section) => {
    alert(`Insert action for ${section}`);
    // Add axios POST request here
  };

  const handleUpdate = (section) => {
    alert(`Update action for ${section}`);
    // Add axios PUT request here
  };

  const handleDelete = (section) => {
    alert(`Delete action for ${section}`);
    // Add axios DELETE request here
  };

  return (
    <div className="admin-panel">
      {/* Sidebar for desktop */}
      <div className="d-none d-md-block">
        <AdminSidebar />
      </div>

      {/* Offcanvas sidebar for mobile */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        responsive="md"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AdminSidebar />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main content */}
      <div className="admin-content">
        {/* Mobile menu toggle */}
        <div className="d-md-none mb-3">
          <Button onClick={() => setShowSidebar(true)}>☰ Menu</Button>
        </div>

        <Container fluid className="admin-about mt-4">
          <h2 className="about-heading text-center mb-4">About Our Admin Panel</h2>

          <Row className="mt-4">
            <Col md={6} sm={12}>
              <Card className="about-card p-3 mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="card-title">User Management</Card.Title>
                  <Card.Text className="card-text">
                    Easily add, edit, or remove users and assign roles to control access
                    to different parts of the admin panel.
                  </Card.Text>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <Button variant="success" onClick={() => handleInsert("User Management")}>
                      Insert
                    </Button>
                    <Button variant="warning" onClick={() => handleUpdate("User Management")}>
                      Update
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete("User Management")}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} sm={12}>
              <Card className="about-card p-3 mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="card-title">Customer Analytics</Card.Title>
                  <Card.Text className="card-text">
                    Track customer activity, view detailed reports, and gain insights
                    to improve business decisions and customer engagement.
                  </Card.Text>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <Button variant="success" onClick={() => handleInsert("Customer Analytics")}>
                      Insert
                    </Button>
                    <Button variant="warning" onClick={() => handleUpdate("Customer Analytics")}>
                      Update
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete("Customer Analytics")}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="about-card p-3 mt-3 shadow-sm">
            <Card.Body>
              <Card.Title className="card-title">System Overview</Card.Title>
              <Card.Text className="card-text">
                Our admin panel provides a comprehensive overview of operations,
                including dashboards, reports, and real-time system monitoring.
              </Card.Text>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <Button variant="success" onClick={() => handleInsert("System Overview")}>
                  Insert
                </Button>
                <Button variant="warning" onClick={() => handleUpdate("System Overview")}>
                  Update
                </Button>
                <Button variant="danger" onClick={() => handleDelete("System Overview")}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AdminAbout;
