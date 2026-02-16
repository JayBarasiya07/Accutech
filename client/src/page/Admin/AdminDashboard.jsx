import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Badge,
  Form,
} from "react-bootstrap";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false);

  const rowsPerPage = 10;

  // ===============================
  // FETCH CUSTOMERS + USERS (FIXED)
  // ===============================
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token missing! Please login again.");
      }

      // ===============================
      // FETCH CUSTOMERS
      // ===============================
      const custRes = await fetch("http://localhost:8000/api/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const custData = await custRes.json();
      console.log("CUSTOMERS API RESPONSE =>", custData);

      if (!custRes.ok) {
        throw new Error(custData.message || "Failed to fetch customers");
      }

      setCustomers(Array.isArray(custData) ? custData : []);

      // ===============================
      // FETCH USERS
      // ===============================
      const userRes = await fetch("http://localhost:8000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userRes.json();
      console.log("USERS API RESPONSE =>", userData);

      if (!userRes.ok) {
        throw new Error(userData.message || "Failed to fetch users");
      }

      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset on search change
  useEffect(() => {
    setCurrentPage(1);
    setSelectAllAcrossPages(false);
    setSelectedCustomers([]);
  }, [search]);

  // ===============================
  // COUNTS
  // ===============================
  const totalUsers = users.filter(
    (u) => u.role?.toLowerCase() === "user"
  ).length;

  const totalAdmins = users.filter(
    (u) => u.role?.toLowerCase() === "admin"
  ).length;

  const totalCustomers = customers.length;

  // ===============================
  // FILTER CUSTOMERS
  // ===============================
  const filteredCustomers = useMemo(() => {
    const s = search.toLowerCase();

    return customers.filter((c) => {
      const name = (
        c.customername ||
        c.customerName ||
        c.name ||
        ""
      ).toLowerCase();

      const srNo = (c.srNo || "").toLowerCase();
      const category = (c.category || "").toLowerCase();

      return name.includes(s) || srNo.includes(s) || category.includes(s);
    });
  }, [customers, search]);

  // ===============================
  // PAGINATION
  // ===============================
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);

  // ===============================
  // SELECT CUSTOMER
  // ===============================
  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedCustomers((prev) => [...prev, id]);
    } else {
      setSelectedCustomers((prev) => prev.filter((cid) => cid !== id));
      setSelectAllAcrossPages(false);
    }
  };

  // Select all on current page
  const handleSelectAllPage = (e) => {
    const pageIds = currentCustomers.map((c) => c._id);

    if (e.target.checked) {
      setSelectedCustomers((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => !pageIds.includes(id)));
      setSelectAllAcrossPages(false);
    }
  };

  // Select all across all pages
  const handleSelectAllAcrossPages = (e) => {
    if (e.target.checked) {
      setSelectAllAcrossPages(true);
      setSelectedCustomers(filteredCustomers.map((c) => c._id));
    } else {
      setSelectAllAcrossPages(false);
      setSelectedCustomers([]);
    }
  };

  // ===============================
  // EXPORT DATA
  // ===============================
  const customersToExport =
    selectedCustomers.length > 0
      ? customers.filter((c) => selectedCustomers.includes(c._id))
      : filteredCustomers;

  const exportExcel = () => {
    if (customersToExport.length === 0) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      customersToExport.map((c) => ({
        "Sr No": c.srNo || "-",
        Category: c.category || "-",
        "Customer Name": c.customername || c.customerName || c.name || "-",
        "Sales Person": c.salesPerson || "-",
        Offices: c.offices || "-",
        Plants: c.plants || "-",
        Location: c.location || "-",
        "Contact Person": c.contactPerson || "-",
        Department: c.department || "-",
        Designation: c.designation || "-",
        Mobile: c.mobile || "-",
        Email: c.email || "-",
        Decision: c.decision || "-",
        "Current UPS": c.currentUPS || "-",
        "Scope SRC": c.scopeSRC || "-",
        Racks: c.racks || "-",
        Cooling: c.cooling || "-",
        "Room Age": c.roomAge || "-",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "customers.xlsx"
    );
  };

  const exportPDF = () => {
    if (customersToExport.length === 0) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF("landscape");

    const tableColumn = [
      "No.",
      "Sr No",
      "Category",
      "Customer Name",
      "Sales Person",
      "Offices",
      "Plants",
      "Location",
      "Contact Person",
      "Department",
      "Designation",
      "Mobile",
      "Email",
      "Decision",
      "Current UPS",
      "Scope SRC",
      "Racks",
      "Cooling",
      "Room Age",
    ];

    const tableRows = customersToExport.map((c, i) => [
      i + 1,
      c.srNo || "-",
      c.category || "-",
      c.customername || c.customerName || c.name || "-",
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
      c.currentUPS || "-",
      c.scopeSRC || "-",
      c.racks || "-",
      c.cooling || "-",
      c.roomAge || "-",
    ]);

    doc.text("Customer List", 14, 15);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 7 },
    });

    doc.save("customers.pdf");
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="admin-content p-4 w-100">
      <h2 className="mb-4">Admin Dashboard</h2>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Stat Cards */}
      <Row className="mb-4">
        <Col md={4} sm={12} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6>Total Customers</h6>
              <Badge bg="primary" style={{ fontSize: "1.2rem" }}>
                {totalCustomers}
              </Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6>Total Users</h6>
              <Badge bg="success" style={{ fontSize: "1.2rem" }}>
                {totalUsers}
              </Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12} className="mb-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6>Total Admins</h6>
              <Badge bg="warning" text="dark" style={{ fontSize: "1.2rem" }}>
                {totalAdmins}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search + Export */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px" }}
        />

        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-primary" onClick={fetchData}>
            Refresh
          </Button>

          <Button variant="success" onClick={exportExcel}>
            Export Excel
          </Button>

          <Button variant="danger" onClick={exportPDF}>
            Export PDF
          </Button>

          <Form.Check
            type="checkbox"
            label="Select All Across Pages"
            checked={selectAllAcrossPages}
            onChange={handleSelectAllAcrossPages}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {currentCustomers.length === 0 ? (
            <Alert variant="warning">No customers found.</Alert>
          ) : (
            <Table striped hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={
                        currentCustomers.length > 0 &&
                        currentCustomers.every((c) =>
                          selectedCustomers.includes(c._id)
                        )
                      }
                      onChange={handleSelectAllPage}
                    />
                  </th>
                  <th>#</th>
                  <th>Sr No</th>
                  <th>Category</th>
                  <th>Customer Name</th>
                  <th>Sales Person</th>
                  <th>Offices</th>
                  <th>Plants</th>
                  <th>Location</th>
                  <th>Contact Person</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Decision</th>
                  <th>Current UPS</th>
                  <th>Scope SRC</th>
                  <th>Racks</th>
                  <th>Cooling</th>
                  <th>Room Age</th>
                </tr>
              </thead>

              <tbody>
                {currentCustomers.map((c, i) => (
                  <tr key={c._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedCustomers.includes(c._id)}
                        onChange={(e) => handleSelectOne(e, c._id)}
                      />
                    </td>

                    <td>{indexOfFirst + i + 1}</td>
                    <td>{c.srNo || "-"}</td>
                    <td>{c.category || "-"}</td>
                    <td>{c.customername || c.customerName || c.name || "-"}</td>
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
                    <td>{c.currentUPS || "-"}</td>
                    <td>{c.scopeSRC || "-"}</td>
                    <td>{c.racks || "-"}</td>
                    <td>{c.cooling || "-"}</td>
                    <td>{c.roomAge || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>

            <span className="align-self-center">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
