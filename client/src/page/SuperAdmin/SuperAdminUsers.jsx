import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table, Button, Form, Modal, Row, Col,
  Spinner, Alert, Badge, Card, ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaKey, FaSync, FaCheckDouble, FaTimesCircle } from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const API_BASE = "http://localhost:8000/api/users";
const PERMISSION_API = "http://localhost:8000/api/permissions";

const permissionFields = [
  "srNo", "category", "salesPerson", "offices", "plants", "location",
  "contactPerson", "department", "designation", "mobile", "email",
  "decision", "currentUPS", "scopeSRC", "racks", "cooling", "roomAge",
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

      const data = await res.json();
      setUsers(data);
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
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // Toggle permission
  const togglePermission = (field) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: {
        ...(prev.permissions || {}),
        [field]: !prev.permissions?.[field],
      },
    }));
  };

  // Select all / clear all
  const bulkPermissions = (value) => {
    const updated = {};
    permissionFields.forEach((f) => (updated[f] = value));

    setCurrentUser((prev) => ({
      ...prev,
      permissions: updated,
    }));
  };

  const savePermissions = async () => {
    if (!currentUser) return;

    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/${currentUser._id}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissions: currentUser.permissions }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      showAlert(`Permissions updated for ${currentUser.name}`, "success");
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

    if (!window.confirm("Are you sure? This action is irreversible.")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setUsers((prev) => prev.filter((u) => u._id !== id));
      showAlert("User successfully removed", "success");
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 text-primary">User Access Control</h4>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={loadUsers}
              disabled={loading}
            >
              <FaSync className={loading ? "fa-spin" : ""} />{" "}
              {loading ? "Loading..." : "Refresh List"}
            </Button>
          </div>

          {status && (
            <Alert variant={status.type} className="py-2">
              {status.msg}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Access Level</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => {
                  const count = Object.values(u.permissions || {}).filter(
                    Boolean
                  ).length;
                  const progress = (count / permissionFields.length) * 100;

                  return (
                    <tr key={u._id}>
                      <td>{i + 1}</td>

                      <td>
                        <div className="fw-bold">{u.name}</div>
                        <small className="text-muted">{u.email}</small>
                      </td>

                      <td>
                        <Badge pill bg="info">
                          {u.role}
                        </Badge>
                      </td>

                      <td style={{ minWidth: "160px" }}>
                        <div className="small mb-1">
                          {count} of {permissionFields.length} enabled
                        </div>
                        <ProgressBar
                          now={progress}
                          variant={progress === 100 ? "success" : "info"}
                          style={{ height: "6px" }}
                        />
                      </td>

                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="light"
                          className="me-2 text-primary border"
                          onClick={() => {
                            // deep clone to prevent table data mutation
                            setCurrentUser(JSON.parse(JSON.stringify(u)));
                            setShowModal(true);
                          }}
                        >
                          <FaKey /> Manage
                        </Button>

                        <Button
                          size="sm"
                          variant="light"
                          className="text-danger border"
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Permissions: {currentUser?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light-subtle">
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded border">
            <div>
              <h6 className="mb-1">Access Progress</h6>
              <small className="text-muted">{activeCount} modules active</small>
            </div>

            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-success"
                onClick={() => bulkPermissions(true)}
              >
                <FaCheckDouble /> Select All
              </Button>

              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => bulkPermissions(false)}
              >
                <FaTimesCircle /> Clear All
              </Button>
            </div>
          </div>

          <Row className="g-3">
            {permissionFields.map((field) => (
              <Col md={4} key={field}>
                <Card
                  className={`h-100 shadow-sm ${
                    currentUser?.permissions?.[field]
                      ? "border-success bg-success-subtle"
                      : "border-light"
                  }`}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onClick={() => togglePermission(field)}
                >
                  <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                    <span className="small fw-semibold">
                      {formatLabel(field)}
                    </span>

                    <Form.Check
                      type="switch"
                      checked={!!currentUser?.permissions?.[field]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => togglePermission(field)}
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="link"
            className="text-muted text-decoration-none"
            onClick={() => setShowModal(false)}
          >
            Discard Changes
          </Button>

          <Button
            variant="primary"
            onClick={savePermissions}
            disabled={saving}
            className="px-4"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" /> Saving...
              </>
            ) : (
              "Apply Permissions"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </SuperAdminLayout>
  );
};

export default AdminUsers;
