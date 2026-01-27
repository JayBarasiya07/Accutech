import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Alert, Spinner } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Ensure token exists
      if (!token) throw new Error("Token missing! Please login again.");

      const [custRes, usersRes] = await Promise.all([
        fetch("http://localhost:8000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!custRes.ok) throw new Error("Failed to fetch customers");
      if (!usersRes.ok) throw new Error("Failed to fetch users");

      const customersData = await custRes.json();
      const usersData = await usersRes.json();

      setCustomers(customersData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // ---------------- COUNTS ----------------
  const totalUsers = users.filter(u => u.role === "user").length;
  const totalAdmins = users.filter(u => u.role === "admin").length;

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="admin-content p-4 w-100">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h2>Admin Dashboard</h2>
          <Button onClick={fetchData} variant="outline-primary">Refresh</Button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
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
                    <Card.Title>Total Admins</Card.Title>
                    <Card.Text style={{ fontSize: "2rem" }}>{totalAdmins}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* ---------------- CUSTOMER TABLE ---------------- */}
            <h2 className="mb-3">Customer List</h2>
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
                {customers.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td>{c.srNo}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;