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
  FaSync,
} from "react-icons/fa";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const ROLES = ["user", "admin"]; 
const API_BASE = "http://localhost:8000/api/users";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Increased for better layout

  const token = localStorage.getItem("token");

  // Helper: Auto-dismissing alerts
  const showAlert = (msg, type = "success") => {
    setStatus({ msg, type });
    setTimeout(() => setStatus({ msg: "", type: "" }), 5000);
  };

  // ================= FETCH USERS =================
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is permanent.")) return;
    
    setUpdatingUserId(id);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      showAlert("User removed from system ✅");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ================= UPDATE ROLE =================
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Update failed");
      }

      showAlert(`Permission level changed to ${newRole.toUpperCase()} ✅`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ================= LOGIC: SEARCH & PAGINATION =================
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const stats = {
    user: users.filter((u) => u.role === "user").length,
    admin: users.filter((u) => u.role === "admin").length,
    superadmin: users.filter((u) => u.role === "superadmin").length,
  };

  return (
    <SuperAdminLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">User Management</h2>
            <p className="text-muted">Manage system access levels and credentials</p>
          </div>
          <Button variant="primary" className="shadow-sm" onClick={fetchUsers} disabled={loading}>
            {loading ? <Spinner size="sm" /> : <><FaSync className="me-2" /> Refresh Data</>}
          </Button>
        </div>

        {status.msg && (
          <Alert variant={status.type} className="shadow-sm" dismissible onClose={() => setStatus({ msg: "", type: "" })}>
            {status.msg}
          </Alert>
        )}

        {/* STATS CARDS */}
        <Row className="mb-4 g-3">
          {[
            { label: "Total Users", count: stats.user, icon: FaUsers, color: "primary" },
            { label: "Admins", count: stats.admin, icon: FaUserShield, color: "success" },
            { label: "SuperAdmins", count: stats.superadmin, icon: FaCrown, color: "warning" },
          ].map((s, i) => (
            <Col md={4} key={i}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className={`bg-${s.color} bg-opacity-10 p-3 rounded-circle me-3`}>
                    <s.icon size={24} className={`text-${s.color}`} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">{s.label}</h6>
                    <h3 className="fw-bold mb-0">{s.count}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* USER TABLE CARD */}
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white py-3">
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                className="bg-light border-start-0 shadow-none"
                placeholder="Search by name, email or designation..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </InputGroup>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Synchronizing user data...</p>
              </div>
            ) : (
              <>
                <Table hover responsive className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">User Details</th>
                      <th>Access Level</th>
                      <th className="text-end pe-4">System Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => {
                        const isSuperAdmin = user.role === "superadmin";
                        const isUpdating = updatingUserId === user._id;

                        return (
                          <tr key={user._id}>
                            <td className="ps-4 py-3">
                              <div className="d-flex align-items-center">
                                <div className="avatar-placeholder me-3 bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                  {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{user.name}</div>
                                  <div className="text-muted small">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              {isSuperAdmin ? (
                                <Badge bg="dark" className="px-3 py-2">
                                  <FaCrown className="me-2 text-warning" /> SUPERADMIN
                                </Badge>
                              ) : (
                                <Form.Select
                                  size="sm"
                                  className="form-select-sm border-0 bg-light fw-medium"
                                  style={{ width: "140px" }}
                                  value={user.role}
                                  disabled={isUpdating}
                                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                                >
                                  {ROLES.map((role) => (
                                    <option key={role} value={role}>
                                      {role.toUpperCase()}
                                    </option>
                                  ))}
                                </Form.Select>
                              )}
                            </td>
                            <td className="text-end pe-4">
                              <OverlayTrigger
                                placement="left"
                                overlay={<Tooltip>{isSuperAdmin ? "Protected Account" : "Delete User"}</Tooltip>}
                              >
                                <span>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="rounded-circle border-0"
                                    disabled={isSuperAdmin || isUpdating}
                                    onClick={() => deleteUser(user._id)}
                                  >
                                    {isUpdating ? <Spinner size="sm" /> : <FaTrash />}
                                  </Button>
                                </span>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-5 text-muted">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center py-4 border-top">
                    <Pagination className="mb-0">
                      <Pagination.Prev 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)} 
                      />
                      {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)} 
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;