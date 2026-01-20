// src/pages/Admin/AdminUsers.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Button, Form, Modal, Row, Col } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { useNavigate } from "react-router-dom";

const permissionFields = [
  "srNo","category","salesPerson","offices","plants","location",
  "contactPerson","department","designation","mobile","email",
  "decision","currentUPS","scopeSRC","racks","cooling","roomAge"
];

const AdminUsers = ({ searchTerm = "" }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Access denied");
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const openPermissionModal = (user) => {
    setCurrentUser({
      ...user,
      permissions: user.permissions || {}
    });
    setShowModal(true);
  };

  const togglePermission = (key) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions?.[key],
      },
    }));
  };

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

      if (!res.ok) {
        alert("Permission update failed");
        return;
      }

      setShowModal(false);
      setCurrentUser(null);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Row className="g-0">
      <Col md={2} className="bg-light min-vh-100 sidebar">
        <AdminSidebar />
      </Col>

      <Col md={10} className="p-4">
        <h2>User Permission Manager</h2>

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
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{Object.keys(user.permissions || {}).length}</td>
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
            ))}
          </tbody>
        </Table>

        {/* Permission Modal */}
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
      </Col>
    </Row>
  );
};

export default AdminUsers;
