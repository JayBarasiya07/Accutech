// src/pages/Admin/AdminUsers.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Button, Form, Modal, Row, Col } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { useNavigate } from "react-router-dom";

const AdminUsers = ({ searchTerm = "" }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // JWT token after login

  // -------------------------------
  // Redirect if not logged in
  // -------------------------------
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // -------------------------------
  // Fetch users from backend
  // -------------------------------
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert("Access denied. Admins only.");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) loadUsers();
  }, [loadUsers, token]);

  // -------------------------------
  // Filter users by search term
  // -------------------------------
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // -------------------------------
  // Open edit modal
  // -------------------------------
  const openEditModal = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // -------------------------------
  // Update user role
  // -------------------------------
  const updateUserRole = async () => {
    if (!currentUser.role) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/users/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: currentUser.role }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Update failed");
        return;
      }

      setShowModal(false);
      setCurrentUser(null);
      loadUsers();
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  // -------------------------------
  // Delete user
  // -------------------------------
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Delete failed");
        return;
      }

      loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Row className="g-0">
      {/* Sidebar */}
      <Col md={2} className="bg-light min-vh-100 sidebar">
        <AdminSidebar />
      </Col>

      {/* Main Content */}
      <Col md={10} className="p-4">
        <h2>All Users</h2>

        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status || "Active"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2 mb-1"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Edit Role Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit User Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentUser && (
              <Form>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={currentUser.role}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
                <Button
                  className="mt-3"
                  onClick={updateUserRole}
                  variant="primary"
                >
                  Update
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
};

export default AdminUsers;
