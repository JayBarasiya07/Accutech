import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Pagination,
  Col,
  Row,
  Offcanvas,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminCustomerList = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isAdminOrSuper = role === "admin" || role === "superadmin";

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;

  // ================= FETCH CUSTOMERS =================
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:8000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch customers error:", err);

      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError(err?.response?.data?.message || "Failed to fetch customers");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCustomers();
  }, [token]);

  // ================= DELETE CUSTOMER =================
  const handleDelete = async (id) => {
    if (!isAdminOrSuper) {
      alert("Access denied! Only Admin/SuperAdmin can delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  // ================= SEARCH FILTER =================
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const values = [
        cust.srNo,
        cust.category,
        cust.customername,
        cust.salesPerson,
        cust.offices,
        cust.plants,
        cust.location,
        cust.contactPerson,
        cust.department,
        cust.designation,
        cust.mobile,
        cust.email,
        cust.decision,
        cust.currentUPS,
        cust.scopeSRC,
        cust.racks,
        cust.cooling,
        cust.roomAge,
      ]
        .map((v) => (v ? v.toString().toLowerCase() : ""))
        .join(" ");

      return values.includes(searchTerm.toLowerCase());
    });
  }, [customers, searchTerm]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const paginatedData = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  // ================= AUTH =================
  if (!token) return <Navigate to="/login" replace />;

  const columns = [
    "No",
    "SrNo",
    "Category",
    "CustomerName",
    "SalesPerson",
    "Offices",
    "Plants",
    "Location",
    "ContactPerson",
    "Department",
    "Designation",
    "Mobile",
    "Email",
    "Decision",
    "CurrentUPS",
    "ScopeSRC",
    "Racks",
    "Cooling",
    "RoomAge",
  ];

  return (
    <Row className="g-0">
      {/* Sidebar desktop (Only Admin/SuperAdmin) */}
      {isAdminOrSuper && (
        <Col md={2} className="d-none d-md-block p-0 bg-dark">
          <AdminSidebar />
        </Col>
      )}

      {/* Sidebar mobile */}
      {isAdminOrSuper && (
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <AdminSidebar />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Main content */}
      <Col md={isAdminOrSuper ? 10 : 12} className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            {isAdminOrSuper && (
              <Button
                variant="dark"
                className="d-md-none"
                onClick={() => setShowSidebar(true)}
              >
                ☰
              </Button>
            )}

            <h2 className="mb-0">Customer List</h2>
          </div>

          {/* Add button only Admin/SuperAdmin */}
          {isAdminOrSuper && (
            <Link to="/admin/customers/add">
              <Button variant="success">+ Add New Customer</Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 Search customer..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Form>

        {/* Error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading customers...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-dark">
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}

                  {/* Actions only Admin/SuperAdmin */}
                  {isAdminOrSuper && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((cust, idx) => (
                    <tr key={cust._id}>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{cust.srNo || "-"}</td>
                      <td>{cust.category || "-"}</td>
                      <td>{cust.customername || "-"}</td>
                      <td>{cust.salesPerson || "-"}</td>
                      <td>{cust.offices || "-"}</td>
                      <td>{cust.plants || "-"}</td>
                      <td>{cust.location || "-"}</td>
                      <td>{cust.contactPerson || "-"}</td>
                      <td>{cust.department || "-"}</td>
                      <td>{cust.designation || "-"}</td>
                      <td>{cust.mobile || "-"}</td>
                      <td>{cust.email || "-"}</td>
                      <td>{cust.decision || "-"}</td>
                      <td>{cust.currentUPS || "-"}</td>
                      <td>{cust.scopeSRC || "-"}</td>
                      <td>{cust.racks || "-"}</td>
                      <td>{cust.cooling || "-"}</td>
                      <td>{cust.roomAge || "-"}</td>

                      {/* Actions only Admin/SuperAdmin */}
                      {isAdminOrSuper && (
                        <td className="text-center">
                          <Link to={`/admin/customers/edit/${cust._id}`}>
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                            >
                              Edit
                            </Button>
                          </Link>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(cust._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdminOrSuper ? columns.length + 1 : columns.length}
                      className="text-center"
                    >
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
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
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        )}
      </Col>
    </Row>
  );
};

export default AdminCustomerList;
