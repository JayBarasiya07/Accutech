// src/pages/Admin/AdminUsers.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Button, Form, Modal, Row, Col } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminUsers = ({ searchTerm = "" }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch users
  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter by search term
  const filtered = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const openEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const updateRole = async () => {
    try {
      await fetch(`http://localhost:8000/api/users/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: currentUser.role }),
      });
      setShowModal(false);
      loadUsers();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`http://localhost:8000/api/users/${id}`, { method: "DELETE" });
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
            {filtered.length > 0 ? (
              filtered.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status || "Active"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2 mb-1"
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteUser(u._id)}
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
                <Button className="mt-3" onClick={updateRole}>
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
