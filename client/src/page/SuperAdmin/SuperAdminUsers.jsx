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
  "srNo","category","salesPerson","offices","plants","location","contactPerson",
  "department","designation","mobile","email","decision","currentUPS","scopeSRC",
  "racks","cooling","roomAge",
];

const AdminUsers = ({ searchTerm = "" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [savingPermissions, setSavingPermissions] = useState(false);

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

      if (res.status === 403) throw new Error("Forbidden: Only SuperAdmin can access");
      if (!res.ok) throw new Error(`Failed to fetch users. Status: ${res.status}`);

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch users ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Open permissions modal
  const openPermissionModal = (user) => {
    setCurrentUser({
      ...user,
      permissions: user.permissions || {},
    });
    setShowModal(true);
  };

  // Toggle single permission
  const togglePermission = (key) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] },
    }));
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const allSelected = {};
    permissionFields.forEach((key) => (allSelected[key] = true));
    setCurrentUser((prev) => ({ ...prev, permissions: allSelected }));
  };

  // Clear all permissions
  const clearAllPermissions = () => {
    const allCleared = {};
    permissionFields.forEach((key) => (allCleared[key] = false));
    setCurrentUser((prev) => ({ ...prev, permissions: allCleared }));
  };

  // Save permissions
  const savePermissions = async () => {
    if (!currentUser?._id) return;

    setSavingPermissions(true);
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

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update permissions");
      }

      setSuccess("Permissions updated successfully ✅");
      setShowModal(false);
      setCurrentUser(null);
      loadUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update permissions ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setSavingPermissions(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUpdatingUserId(id);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to delete user");
      }

      setSuccess("User deleted successfully ✅");
      loadUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete user ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Update role
  const updateRole = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update role");
      }

      setSuccess("Role updated successfully ✅");
      loadUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update role ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdatingUserId(null);
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
        <Button onClick={loadUsers} variant="outline-primary">Refresh</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
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
                        disabled={updatingUserId === user._id}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </Form.Select>
                    </td>
                    <td>{enabledPermissions} / {permissionFields.length}</td>
                    <td className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => openPermissionModal(user)}
                        disabled={savingPermissions || updatingUserId === user._id}
                      >
                        Permissions
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteUser(user._id)}
                        disabled={updatingUserId === user._id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No users found</td>
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
              <div className="mb-3 d-flex gap-2">
                <Button variant="success" size="sm" onClick={selectAllPermissions}>
                  Select All
                </Button>
                <Button variant="secondary" size="sm" onClick={clearAllPermissions}>
                  Clear All
                </Button>
              </div>
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
              <Button
                className="mt-3"
                onClick={savePermissions}
                disabled={savingPermissions}
              >
                {savingPermissions ? "Saving..." : "Save Permissions"}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </SuperAdminLayout>
  );
};

export default AdminUsers;
