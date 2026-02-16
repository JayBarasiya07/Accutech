import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table, Button, Form, Modal, Row, Col,
  Spinner, Alert, Badge, Card, ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaTrash, FaKey, FaSync, FaCheckDouble, 
  FaTimesCircle, FaUserShield, FaUser 
} from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const API_BASE = "http://localhost:8000/api/users";

// List of permission keys
const permissionFields = [
  "srNo", "category", "salesPerson", "offices", "plants", "location",
  "contactPerson", "department", "designation", "mobile", "email",
  "decision", "currentUPS", "scopeSRC", "racks", "cooling", "roomAge",
];

// Helper to turn camelCase into readable Labels
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

  // Get current User ID from token safely
  const loggedInUserId = useMemo(() => {
    try {
      return token ? JSON.parse(atob(token.split(".")[1])).id : null;
    } catch {
      return null;
    }
  }, [token]);

  const showAlert = (msg, type = "success") => {
    setStatus({ msg, type });
    setTimeout(() => setStatus(null), 4000);
  };

  // ================= LOAD DATA =================
  const loadUsers = useCallback(async () => {
    if (!token) return navigate("/login");
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not fetch user list");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ================= FILTERING =================
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // ================= PERMISSION HANDLERS =================
  const togglePermission = (field) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: {
        ...(prev.permissions || {}),
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
      if (!res.ok) throw new Error(data.message || "Failed to update permissions");

      showAlert(`Permissions updated for ${currentUser.name} ✅`, "success");
      setShowModal(false);
      loadUsers(); // Refresh background data
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE HANDLER =================
  const deleteUser = async (id) => {
    if (id === loggedInUserId) return showAlert("Security Error: You cannot delete yourself!", "danger");
    if (!window.confirm("Permanent Action: Are you sure you want to delete this user?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete operation failed");

      setUsers((prev) => prev.filter((u) => u._id !== id));
      showAlert("User account removed successfully", "success");
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
      totalUsers={users.filter(u => u.role === 'user').length}
      totalAdmins={users.filter(u => u.role === 'admin').length}
      refresh={loadUsers}
    >
      <Card className="shadow-sm border-0 mt-3">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">User Access Control</h5>
          <Button size="sm" variant="light" onClick={loadUsers} disabled={loading} className="border">
            <FaSync className={loading ? "fa-spin me-2" : "me-2"} />
            {loading ? "Syncing..." : "Refresh"}
          </Button>
        </Card.Header>
        <Card.Body>
          {status && <Alert variant={status.type} className="py-2 shadow-sm">{status.msg}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Fetching user permissions...</p>
            </div>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Account</th>
                  <th>Role</th>
                  <th>Access Coverage</th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const count = Object.values(u.permissions || {}).filter(Boolean).length;
                  const progress = (count / permissionFields.length) * 100;

                  return (
                    <tr key={u._id}>
                      <td className="ps-3">
                        <div className="d-flex align-items-center">
                          <div className={`p-2 rounded-circle me-3 ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'} bg-opacity-10 text-primary`}>
                            {u.role === 'admin' ? <FaUserShield /> : <FaUser />}
                          </div>
                          <div>
                            <div className="fw-bold">{u.name}</div>
                            <div className="small text-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge pill bg={u.role === 'admin' ? 'primary' : 'light'} className={u.role !== 'admin' ? 'text-dark border' : ''}>
                          {u.role?.toUpperCase()}
                        </Badge>
                      </td>
                      <td style={{ minWidth: "200px" }}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span>{count} modules</span>
                          <span className="text-muted">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar now={progress} variant={progress === 100 ? "success" : "primary"} style={{ height: "6px" }} />
                      </td>
                      <td className="text-end pe-3">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => {
                            setCurrentUser(JSON.parse(JSON.stringify(u))); // Deep clone
                            setShowModal(true);
                          }}
                        >
                          <FaKey className="me-1" /> Access
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={deletingId === u._id || u._id === loggedInUserId}
                          onClick={() => deleteUser(u._id)}
                        >
                          {deletingId === u._id ? <Spinner size="sm" /> : <FaTrash />}
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
      <Modal show={showModal} onHide={() => !saving && setShowModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h6 fw-bold">Manage Permissions: {currentUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light-subtle">
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded border shadow-sm">
            <div>
              <p className="mb-0 small fw-bold">Quick Actions</p>
              <small className="text-muted">{activeCount} of {permissionFields.length} permissions enabled</small>
            </div>
            <div className="d-flex gap-2">
              <Button size="sm" variant="outline-success" onClick={() => bulkPermissions(true)}><FaCheckDouble className="me-1" /> All</Button>
              <Button size="sm" variant="outline-danger" onClick={() => bulkPermissions(false)}><FaTimesCircle className="me-1" /> None</Button>
            </div>
          </div>

          <Row className="g-2">
            {permissionFields.map((field) => (
              <Col md={4} key={field}>
                <div 
                  className={`p-2 rounded border d-flex justify-content-between align-items-center transition-all ${currentUser?.permissions?.[field] ? 'bg-white border-primary' : 'bg-light text-muted'}`}
                  style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                  onClick={() => togglePermission(field)}
                >
                  <span className={currentUser?.permissions?.[field] ? 'fw-bold' : ''}>{formatLabel(field)}</span>
                  <Form.Check 
                    type="switch"
                    checked={!!currentUser?.permissions?.[field]}
                    onChange={() => {}} // Handled by div onClick
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-white">
          <Button variant="link" className="text-muted" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={savePermissions} disabled={saving} className="px-4 shadow-sm">
            {saving ? <><Spinner size="sm" className="me-2" /> Saving...</> : "Save Permissions"}
          </Button>
        </Modal.Footer>
      </Modal>
    </SuperAdminLayout>
  );
};

export default AdminUsers;