import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";
 // optional custom CSS for styling

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchUsers();
  }, []);

  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="admin-content p-4" style={{ width: "100%" }}>
        {/* Cards */}
        <Row className="mb-5">
          <Col md={4} sm={12}>
            <Card bg="primary" text="white" className="mb-2">
              <Card.Body>
                <Card.Title>Total Customers</Card.Title>
                <Card.Text style={{ fontSize: "2rem" }}>
                  {customers.length}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card bg="success" text="white" className="mb-2">
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text style={{ fontSize: "2rem" }}>{totalUsers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={12}>
            <Card bg="warning" text="white" className="mb-2">
              <Card.Body>
                <Card.Title>Total Admins</Card.Title>
                <Card.Text style={{ fontSize: "2rem" }}>{totalAdmins}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Customers Table */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Customer List</h2>
          <Button variant="success">Add Customer</Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No.</th>
              <th>Sr No</th>
              <th>Category</th>
              <th>Customer Name</th>
              <th>Sales Person</th>
              <th>Offices</th>
              <th>Plants</th>
              <th>Location</th>
              <th>Contact Person</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Decision</th>
              <th>Current UPS</th>
              <th>Scope SRC</th>
              <th>Racks</th>
              <th>Cooling</th>
              <th>Room Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.SrNo}</td>
                <td>{c.category}</td>
                <td>{c.name}</td>
                <td>{c.salesPerson}</td>
                <td>{c.offices}</td>
                <td>{c.plants}</td>
                <td>{c.location}</td>
                <td>{c.contactPerson}</td>
                <td>{c.department}</td>
                <td>{c.designation}</td>
                <td>{c.mobile}</td>
                <td>{c.email}</td>
                <td>{c.decision}</td>
                <td>{c.currentUPS}</td>
                <td>{c.scopeSRC}</td>
                <td>{c.racks}</td>
                <td>{c.cooling}</td>
                <td>{c.roomAge}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
