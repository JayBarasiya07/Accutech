import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Alert } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [error] = useState("");

  const token = localStorage.getItem("token"); // JWT auth token if needed

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers and users in parallel
        const [custRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/api/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!custRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [customersData, usersData] = await Promise.all([
          custRes.json(),
          usersRes.json(),
        ]);

        setCustomers(customersData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
       
      }
    };

    fetchData();
  }, [token]);

  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="admin-content p-4 w-100">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ---------------- CARDS ---------------- */}
        <Row className="mb-5">
          <Col md={4} sm={12}>
            <Card bg="primary" text="white" className="mb-2">
              <Card.Body>
                <Card.Title>Total Customers</Card.Title>
                <Card.Text style={{ fontSize: "2rem" }}>{customers.length}</Card.Text>
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
                <Card.Title>Total Admins Access</Card.Title>
                <Card.Text style={{ fontSize: "2rem" }}>{totalAdmins}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ---------------- CUSTOMER TABLE ---------------- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Customer List</h2>
         
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
              
            </tr>
          </thead>
          <tbody>
            {customers.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.srNo || c.SrNo}</td>
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
              
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
