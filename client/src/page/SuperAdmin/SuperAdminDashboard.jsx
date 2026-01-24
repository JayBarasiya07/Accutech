import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form, Card, Row, Col, Badge } from "react-bootstrap";
import { FaUsers, FaUserShield, FaCrown, FaTrash, FaEdit } from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const roles = ["user", "admin", "superadmin"];

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`http://localhost:8000/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const updateUser = async (id, role) => {
    await fetch(`http://localhost:8000/api/users/${id}/role`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  };

  useEffect(() => { fetchUsers(); }, []);

  const totalUsers = users.filter(u => u.role === "user").length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalSuperAdmins = users.filter(u => u.role === "superadmin").length;

  return (
    <SuperAdminLayout>
      <h2 className="mb-4">SuperAdmin Dashboard</h2>

      {/* STAT CARDS */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FaUsers size={28} className="text-primary mb-2" />
              <h6>Users</h6>
              <Badge bg="primary">{totalUsers}</Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FaUserShield size={28} className="text-success mb-2" />
              <h6>Admins</h6>
              <Badge bg="success">{totalAdmins}</Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FaCrown size={28} className="text-warning mb-2" />
              <h6>SuperAdmins</h6>
              <Badge bg="warning" text="dark">{totalSuperAdmins}</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th width="180">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Form.Select
                    value={user.role}
                    onChange={(e) =>
                      setUsers(prev =>
                        prev.map(u =>
                          u._id === user._id ? { ...u, role: e.target.value } : u
                        )
                      )
                    }
                  >
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </Form.Select>
                </td>
                <td className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => updateUser(user._id, user.role)}
                  >
                    <FaEdit /> Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
