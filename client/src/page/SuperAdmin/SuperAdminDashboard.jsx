import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  Card,
  Row,
  Col,
  Badge,
  InputGroup,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaUsers,
  FaUserShield,
  FaCrown,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const ROLES = ["user", "admin"]; // 🚫 superadmin removed from UI
const API_BASE = "http://localhost:8000/api/users";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const token = localStorage.getItem("token");

  const showAlert = (msg, type = "success") => {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: "", type: "" }), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      showAlert(err.message || "Something went wrong ❌", "danger");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    setUpdatingUserId(id);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete user");
      showAlert("User deleted successfully ✅");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const updateUserRole = async (id, newRole) => {
    setUpdatingUserId(id);
    try {
      const res = await fetch(`${API_BASE}/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      showAlert(`Role updated to ${newRole.toUpperCase()} ✅`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Search + Pagination
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const stats = {
    user: users.filter((u) => u.role === "user").length,
    admin: users.filter((u) => u.role === "admin").length,
    superadmin: users.filter((u) => u.role === "superadmin").length,
  };

  return (
    <SuperAdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>SuperAdmin Dashboard</h2>
        <Button variant="outline-primary" onClick={fetchUsers} disabled={loading}>
          Refresh
        </Button>
      </div>

      {status.msg && (
        <Alert variant={status.type} dismissible>
          {status.msg}
        </Alert>
      )}

      {/* STATS */}
      <Row className="mb-4">
        {[
          { label: "Users", count: stats.user, icon: FaUsers, color: "primary" },
          { label: "Admins", count: stats.admin, icon: FaUserShield, color: "success" },
          { label: "SuperAdmins", count: stats.superadmin, icon: FaCrown, color: "warning" },
        ].map((s, i) => (
          <Col md={4} key={i}>
            <Card className="text-center shadow-sm border-0">
              <Card.Body>
                <s.icon size={26} className={`text-${s.color} mb-2`} />
                <h6 className="text-muted">{s.label}</h6>
                <h3 className="fw-bold">{s.count}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* TABLE */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : (
            <>
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, i) => {
                    const isSuperAdmin = user.role === "superadmin";
                    const isUpdating = updatingUserId === user._id;

                    return (
                      <tr key={user._id}>
                        <td>{indexOfFirstUser + i + 1}</td>
                        <td>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </td>

                        {/* ROLE */}
                        <td>
                          {isSuperAdmin ? (
                            <Badge bg="warning" text="dark">
                              <FaCrown className="me-1" /> SUPERADMIN 🔒
                            </Badge>
                          ) : (
                            <Form.Select
                              size="sm"
                              style={{ width: 150 }}
                              value={user.role}
                              disabled={isUpdating}
                              onChange={(e) =>
                                updateUserRole(user._id, e.target.value)
                              }
                            >
                              {ROLES.map((r) => (
                                <option key={r}>{r}</option>
                              ))}
                            </Form.Select>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="text-end">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {isSuperAdmin
                                  ? "SuperAdmin cannot be deleted"
                                  : "Delete user"}
                              </Tooltip>
                            }
                          >
                            <span className="d-inline-block">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={isSuperAdmin || isUpdating}
                                onClick={() => deleteUser(user._id)}
                              >
                                {isUpdating ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <FaTrash />
                                )}
                              </Button>
                            </span>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
