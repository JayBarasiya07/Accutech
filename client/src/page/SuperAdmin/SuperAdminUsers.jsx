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
  Badge,
  Card,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaKey, FaSync } from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const API_BASE = "http://localhost:8000/api/users";

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

const formatLabel = (str) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

const AdminUsers = ({ searchTerm = "" }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loggedInUserId = useMemo(() => {
    try {
      return token ? JSON.parse(atob(token.split(".")[1])).id : null;
    } catch {
      return null;
    }
  }, [token]);

  const showAlert = (msg, type = "success") => {
    setStatus({ msg, type });
    setTimeout(() => setStatus(null), 3500);
  };

  const loadUsers = useCallback(async () => {
    if (!token) return navigate("/login");
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load users");
      setUsers(await res.json());
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const togglePermission = (field) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: !prev.permissions?.[field],
      },
    }));
  };

  const bulkPermissions = (value) => {
    const updated = {};
    permissionFields.forEach((f) => (updated[f] = value));
    setCurrentUser((prev) => ({ ...prev, permissions: updated }));
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE}/${currentUser._id}/permissions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permissions: currentUser.permissions }),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      showAlert("Permissions updated successfully");
      setShowModal(false);
      loadUsers();
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id) => {
    if (id === loggedInUserId)
      return showAlert("You cannot delete yourself", "danger");

    if (!window.confirm("Delete this user permanently?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showAlert("User deleted");
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = useMemo(() => {
    if (!currentUser?.permissions) return 0;
    return Object.values(currentUser.permissions).filter(Boolean).length;
  }, [currentUser]);

  return (
    <SuperAdminLayout
      totalUsers={users.filter((u) => u.role === "user").length}
      totalAdmins={users.filter((u) => u.role === "admin").length}
      refresh={loadUsers}
    >
      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h4>User Permission Management</h4>
            <Button size="sm" variant="outline-secondary" onClick={loadUsers}>
              <FaSync /> Refresh
            </Button>
          </div>

          {status && <Alert variant={status.type}>{status.msg}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => {
                  const count = Object.values(u.permissions || {}).filter(
                    Boolean
                  ).length;
                  return (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="fw-bold">{u.name}</div>
                        <small className="text-muted">{u.email}</small>
                      </td>
                      <td>
                        <Badge bg="info" className="text-uppercase">
                          {u.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={count ? "success" : "secondary"}>
                          {count}/{permissionFields.length}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => {
                            setCurrentUser(u);
                            setShowModal(true);
                          }}
                        >
                          <FaKey />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={deletingId === u._id}
                          onClick={() => deleteUser(u._id)}
                        >
                          {deletingId === u._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <FaTrash />
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* PERMISSION MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser?.name} – Permissions</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <ProgressBar
              now={(activeCount / permissionFields.length) * 100}
              label={`${activeCount} enabled`}
            />
          </div>

          <div className="d-flex justify-content-center gap-2 mb-3">
            <Button size="sm" variant="success" onClick={() => bulkPermissions(true)}>
              Select All
            </Button>
            <Button size="sm" variant="danger" onClick={() => bulkPermissions(false)}>
              Clear All
            </Button>
          </div>

          <Row className="g-2">
            {permissionFields.map((field) => (
              <Col md={4} key={field}>
                <div
                  className={`p-2 border rounded d-flex justify-content-between align-items-center ${
                    currentUser?.permissions?.[field]
                      ? "bg-success-subtle border-success"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => togglePermission(field)}
                >
                  <span>{formatLabel(field)}</span>
                  <Form.Check
                    type="switch"
                    checked={!!currentUser?.permissions?.[field]}
                    readOnly
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={savePermissions} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </SuperAdminLayout>
  );
};

export default AdminUsers;