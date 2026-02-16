import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Pagination,
  Col,
  Row,
  Offcanvas,
  Badge,
  Form,
  Stack,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

import SuperAdminSidebar from "../../components/SuperAdmin/SuperAdminSidebar";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SuperAdminCustomerList = () => {
  const token = localStorage.getItem("token");

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;

  // ================= FETCH CUSTOMERS =================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:8000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err?.response?.data?.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCustomers();
  }, [token]);

  // ================= FILTER =================
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      [
        c.srNo,
        c.customername,
        c.mobile,
        c.email,
        c.category,
        c.salesPerson,
        c.offices,
        c.plants,
        c.location,
        c.contactPerson,
        c.department,
        c.designation,
        c.decision,

        // ✅ NEW FIELDS ADDED
        c.currentUPS,
        c.scopeSRC,
        c.racks,

        c.cooling,
        c.roomAge,
      ]
        .map((v) => (v ? v.toString().toLowerCase() : ""))
        .some((v) => v.includes(search.toLowerCase()))
    );
  }, [customers, search]);

  // ================= PAGINATION =================
  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  const paginatedData = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // ================= TOTAL COUNTER ANIMATION =================
  useEffect(() => {
    let start = 0;
    const end = totalCustomers;

    if (end === 0) {
      setAnimatedTotal(0);
      return;
    }

    const timer = setInterval(() => {
      start += Math.ceil(end / 20);

      if (start >= end) {
        setAnimatedTotal(end);
        clearInterval(timer);
      } else {
        setAnimatedTotal(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [totalCustomers]);

  // ================= SELECT =================
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCustomers.map((c) => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const selectedDataForExport =
    selectedIds.length > 0
      ? customers.filter((c) => selectedIds.includes(c._id))
      : filteredCustomers;

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const data = selectedDataForExport.map((c, i) => ({
      No: i + 1,
      SrNo: c.srNo || "-",
      Category: c.category || "-",
      Customer: c.customername || "-",
      Sales: c.salesPerson || "-",
      Offices: c.offices || "-",
      Plants: c.plants || "-",
      Location: c.location || "-",
      Contact: c.contactPerson || "-",
      Department: c.department || "-",
      Designation: c.designation || "-",
      Mobile: c.mobile || "-",
      Email: c.email || "-",
      Decision: c.decision || "-",

      // ✅ NEW FIELDS ADDED
      CurrentUPS: c.currentUPS || "-",
      ScopeSRC: c.scopeSRC || "-",
      Racks: c.racks || "-",

      Cooling: c.cooling || "-",
      RoomAge: c.roomAge || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "Customer_Report.xlsx");
  };

  // ================= EXPORT PDF =================
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    doc.text("Customer List Report", 40, 30);

    doc.autoTable({
      startY: 50,
      head: [
        [
          "No",
          "SrNo",
          "Category",
          "Customer",
          "Sales",
          "Offices",
          "Plants",
          "Location",
          "Contact",
          "Department",
          "Designation",
          "Mobile",
          "Email",
          "Decision",

          // ✅ NEW COLUMNS
          "Current UPS",
          "Scope SRC",
          "Racks",

          "Cooling",
          "Room Age",
        ],
      ],
      body: selectedDataForExport.map((c, i) => [
        i + 1,
        c.srNo || "-",
        c.category || "-",
        c.customername || "-",
        c.salesPerson || "-",
        c.offices || "-",
        c.plants || "-",
        c.location || "-",
        c.contactPerson || "-",
        c.department || "-",
        c.designation || "-",
        c.mobile || "-",
        c.email || "-",
        c.decision || "-",

        // ✅ NEW DATA
        c.currentUPS || "-",
        c.scopeSRC || "-",
        c.racks || "-",

        c.cooling || "-",
        c.roomAge || "-",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 40, 40] },
    });

    doc.save("Customer_Report.pdf");
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers((prev) => prev.filter((c) => c._id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  // ================= AUTH =================
  if (!token) return <Navigate to="/login" replace />;

  // ================= UI =================
  return (
    <SuperAdminLayout>
      <Row className="g-0">
        {/* Mobile Sidebar */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          className="bg-dark text-light"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <SuperAdminSidebar />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <Col xs={12} className="p-4">
          {/* Header */}
          <Card className="border-0 shadow-sm mb-4 bg-primary text-white">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col>
                  <Button
                    variant="light"
                    className="d-md-none me-3"
                    onClick={() => setShowSidebar(true)}
                  >
                    ☰
                  </Button>
                  <h3 className="d-inline-block mb-0 fw-bold">
                    Customer Directory
                  </h3>
                  <p className="mb-0 opacity-75">
                    Manage and monitor your customer database
                  </p>
                </Col>

                <Col xs="auto" className="text-end">
                  <Stack direction="horizontal" gap={2}>
                    <Badge
                      bg="light"
                      text="primary"
                      className="px-3 py-2 fs-6 shadow-sm"
                    >
                      Total: {animatedTotal}
                    </Badge>

                    {selectedIds.length > 0 && (
                      <Badge
                        bg="warning"
                        text="dark"
                        className="px-3 py-2 fs-6 shadow-sm"
                      >
                        Selected: {selectedIds.length}
                      </Badge>
                    )}
                  </Stack>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Toolbar */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Control
                    size="lg"
                    placeholder="🔍 Search customers..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </Col>

                <Col
                  md={6}
                  className="text-md-end d-flex align-items-center justify-content-md-end gap-2 flex-wrap"
                >
                  <Link to="/superadmin/customers/add">
                    <Button variant="primary">+ Add Customer</Button>
                  </Link>

                  <Button
                    variant="success"
                    onClick={exportExcel}
                    disabled={filteredCustomers.length === 0}
                  >
                    Export Excel
                  </Button>

                  <Button
                    variant="danger"
                    onClick={exportPDF}
                    disabled={filteredCustomers.length === 0}
                  >
                    Export PDF
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Error */}
          {error && (
            <Alert variant="danger" className="shadow-sm">
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3 text-muted">Loading customers...</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <Card className="border-0 shadow-sm overflow-auto">
                <div className="table-responsive">
                  <Table hover align="middle" className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>
                          <Form.Check
                            checked={
                              filteredCustomers.length > 0 &&
                              selectedIds.length === filteredCustomers.length
                            }
                            onChange={handleSelectAll}
                          />
                        </th>

                        <th>#</th>
                        <th>SrNo</th>
                        <th>Category</th>
                        <th>Customer</th>
                        <th>Sales Person</th>
                        <th>Offices</th>
                        <th>Plants</th>
                        <th>Location</th>
                        <th>Contact</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Decision</th>

                        {/* ✅ NEW COLUMNS */}
                        <th>Current UPS</th>
                        <th>Scope SRC</th>
                        <th>Racks</th>

                        <th>Cooling</th>
                        <th>Room Age</th>

                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((c, i) => (
                          <tr
                            key={c._id}
                            className={
                              selectedIds.includes(c._id) ? "table-warning" : ""
                            }
                          >
                            <td>
                              <Form.Check
                                checked={selectedIds.includes(c._id)}
                                onChange={() => toggleSelect(c._id)}
                              />
                            </td>

                            <td>
                              {(currentPage - 1) * itemsPerPage + i + 1}
                            </td>

                            <td>{c.srNo || "-"}</td>

                            <td>
                              <Badge bg="info" text="dark">
                                {c.category || "-"}
                              </Badge>
                            </td>

                            <td>{c.customername || "-"}</td>
                            <td>{c.salesPerson || "-"}</td>
                            <td>{c.offices || "-"}</td>
                            <td>{c.plants || "-"}</td>
                            <td>{c.location || "-"}</td>
                            <td>{c.contactPerson || "-"}</td>
                            <td>{c.department || "-"}</td>
                            <td>{c.designation || "-"}</td>
                            <td>{c.mobile || "-"}</td>
                            <td>{c.email || "-"}</td>
                            <td>{c.decision || "-"}</td>

                            {/* ✅ NEW DATA */}
                            <td>{c.currentUPS || "-"}</td>
                            <td>{c.scopeSRC || "-"}</td>
                            <td>{c.racks || "-"}</td>

                            <td>{c.cooling || "-"}</td>
                            <td>{c.roomAge || "-"}</td>

                            <td className="text-center">
                              <Stack
                                direction="horizontal"
                                gap={2}
                                className="justify-content-center"
                              >
                                <Link to={`/superadmin/customers/edit/${c._id}`}>
                                  <Button size="sm" variant="primary">
                                    Update
                                  </Button>
                                </Link>

                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(c._id)}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="22" className="text-center py-5 text-muted">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination className="shadow-sm">
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
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </SuperAdminLayout>
  );
};

export default SuperAdminCustomerList;
