import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form, Card, Row, Col, Badge } from "react-bootstrap";
import { FaUsers, FaUserShield, FaCrown, FaTrash, FaEdit } from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const roles = ["user", "admin", "superadmin"];

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null); // disable buttons during update
  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Something went wrong ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setUpdatingUserId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setSuccess("User deleted successfully ✅");
      fetchUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Delete failed ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Update user role
  const updateUser = async (id, role) => {
    setUpdatingUserId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update role");
      }
      setSuccess(`Role updated to ${role.toUpperCase()} ✅`);
      fetchUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Role update failed ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.filter(u => u.role === "user").length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalSuperAdmins = users.filter(u => u.role === "superadmin").length;

  return (
    <SuperAdminLayout>
      <h2 className="mb-4">SuperAdmin Dashboard</h2>

      {/* Alerts */}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

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

      {/* USERS TABLE */}
      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
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
                    disabled={updatingUserId === user._id}
                  >
                    <FaEdit /> Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                    disabled={updatingUserId === user._id}
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
