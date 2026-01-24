// src/pages/Admin/AdminUsers.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

// Permission fields
const permissionFields = [
  "srNo",
  "category",
  "salesPerson",
  "offices",
  "plants",
  "location",
  "contactPerson",
  "department",
  "designation",
  "mobile",
  "email",
  "decision",
  "currentUPS",
  "scopeSRC",
  "racks",
  "cooling",
  "roomAge",
];

const AdminUsers = ({ searchTerm = "" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403)
        throw new Error("Forbidden: Only SuperAdmin can access");
      if (!res.ok)
        throw new Error(`Failed to fetch users. Status: ${res.status}`);

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Open modal
  const openPermissionModal = (user) => {
    setCurrentUser({
      ...user,
      permissions: user.permissions || {},
    });
    setShowModal(true);
  };

  // Toggle permission checkbox
  const togglePermission = (key) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions?.[key] },
    }));
  };

  // Save permissions
  const savePermissions = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${currentUser._id}/permissions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permissions: currentUser.permissions }),
        }
      );

      if (!res.ok) throw new Error("Failed to update permissions");

      setShowModal(false);
      setCurrentUser(null);
      loadUsers();
      alert("Permissions updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update permissions");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      loadUsers();
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete user");
    }
  };

  // Update user role
  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      loadUsers();
      alert("Role updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update role");
    }
  };

  return (
    <SuperAdminLayout
      totalUsers={users.filter((u) => u.role === "user").length}
      totalAdmins={users.filter((u) => u.role === "admin").length}
      refresh={loadUsers}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User Permission Manager</h2>
        <Button onClick={loadUsers} variant="outline-primary">
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, i) => {
                const enabledPermissions = Object.keys(user.permissions || {}).filter(
                  (k) => user.permissions[k]
                ).length;

                return (
                  <tr key={user._id}>
                    <td>{i + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </Form.Select>
                    </td>
                    <td>
                      {enabledPermissions} / {permissionFields.length}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        className="me-2"
                        onClick={() => openPermissionModal(user)}
                      >
                        Permissions
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Permissions Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Permissions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <Form>
              <Row>
                {permissionFields.map((key) => (
                  <Col md={4} key={key}>
                    <Form.Check
                      type="checkbox"
                      label={key}
                      checked={currentUser.permissions?.[key] || false}
                      onChange={() => togglePermission(key)}
                    />
                  </Col>
                ))}
              </Row>
              <Button className="mt-3" onClick={savePermissions}>
                Save Permissions
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </SuperAdminLayout>
  );
};

export default AdminUsers;
