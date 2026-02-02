import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Table, Button, Alert, Spinner, Badge, Form } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";
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
  const token = localStorage.getItem("token");

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("Token missing! Please login again.");

      const [custRes, usersRes] = await Promise.all([
        fetch("http://localhost:8000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!custRes.ok) throw new Error("Failed to fetch customers");
      if (!usersRes.ok) throw new Error("Failed to fetch users");

      const customersData = await custRes.json();
      const usersData = await usersRes.json();

      setCustomers(customersData);
      setUsers(usersData);
      setSuccess("Data fetched successfully ✅");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong ❌");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectAllAcrossPages(false);
    setSelectedCustomers([]);
  }, [search]);

  // ---------------- COUNTS ----------------
  const totalUsers = users.filter(u => u.role === "user").length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalCustomers = customers.length;

  // ---------------- FILTER CUSTOMERS ----------------
  const filteredCustomers = useMemo(() => {
    const s = search.toLowerCase();
    return customers.filter(c =>
      (c.name || c.customername || "").toLowerCase().includes(s) ||
      (c.srNo || "").toLowerCase().includes(s) ||
      (c.category || "").toLowerCase().includes(s)
    );
  }, [customers, search]);

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);

  // ---------------- HANDLE CHECKBOX ----------------
  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedCustomers(prev => [...prev, id]);
    } else {
      setSelectedCustomers(prev => prev.filter(cid => cid !== id));
      setSelectAllAcrossPages(false);
    }
  };

  const handleSelectAllPage = (e) => {
    if (e.target.checked) {
      const pageIds = currentCustomers.map(c => c._id);
      setSelectedCustomers(prev => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = currentCustomers.map(c => c._id);
      setSelectedCustomers(prev => prev.filter(id => !pageIds.includes(id)));
      setSelectAllAcrossPages(false);
    }
  };

  const handleSelectAllAcrossPages = (e) => {
    if (e.target.checked) {
      setSelectAllAcrossPages(true);
      setSelectedCustomers(filteredCustomers.map(c => c._id));
    } else {
      setSelectAllAcrossPages(false);
      setSelectedCustomers([]);
    }
  };

  // ---------------- EXPORT FUNCTIONS ----------------
  const customersToExport = selectedCustomers.length > 0 ? 
    customers.filter(c => selectedCustomers.includes(c._id)) : filteredCustomers;

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customersToExport.map(c => ({
      "Sr No": c.srNo,
      "Category": c.category,
      "Customer Name": c.name || c.customername,
      "Sales Person": c.salesPerson,
      "Offices": c.offices,
      "Plants": c.plants,
      "Location": c.location,
      "Contact Person": c.contactPerson,
      "Department": c.department,
      "Designation": c.designation,
      "Mobile": c.mobile,
      "Email": c.email,
      "Decision": c.decision,
      "Current UPS": c.currentUPS,
      "Scope SRC": c.scopeSRC,
      "Racks": c.racks,
      "Cooling": c.cooling,
      "Room Age": c.roomAge
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "customers.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No.", "Sr No", "Category", "Customer Name", "Sales Person", "Offices",
      "Plants", "Location", "Contact Person", "Department", "Designation",
      "Mobile", "Email", "Decision", "Current UPS", "Scope SRC", "Racks", "Cooling", "Room Age"
    ];
    const tableRows = customersToExport.map((c, i) => [
      i + 1,
      c.srNo,
      c.category,
      c.name || c.customername,
      c.salesPerson,
      c.offices,
      c.plants,
      c.location,
      c.contactPerson,
      c.department,
      c.designation,
      c.mobile,
      c.email,
      c.decision,
      c.currentUPS,
      c.scopeSRC,
      c.racks,
      c.cooling,
      c.roomAge
    ]);

    doc.text("Customer List", 14, 15);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("customers.pdf");
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="admin-content p-4 w-100">
        <h2 className="mb-4">Admin Dashboard</h2>

        {/* Alerts */}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

        {/* STAT CARDS */}
        <Row className="mb-4">
          <Col md={4} sm={12} className="mb-3">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h6>Total Customers</h6>
                <Badge bg="primary" style={{ fontSize: "1.2rem" }}>{totalCustomers}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={12} className="mb-3">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h6>Total Users</h6>
                <Badge bg="success" style={{ fontSize: "1.2rem" }}>{totalUsers}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={12} className="mb-3">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h6>Total Admins</h6>
                <Badge bg="warning" text="dark" style={{ fontSize: "1.2rem" }}>{totalAdmins}</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* SEARCH + EXPORT */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
          <Form.Control
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: "300px" }}
          />
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={fetchData}>Refresh</Button>
            <Button variant="success" onClick={exportExcel}>Excel</Button>
            <Button variant="danger" onClick={exportPDF}>PDF</Button>
            <Form.Check 
              type="checkbox"
              label="Select All Across Pages"
              checked={selectAllAcrossPages}
              onChange={handleSelectAllAcrossPages}
            />
          </div>
        </div>

        {/* CUSTOMER TABLE */}
        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" /></div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>
                    <Form.Check 
                      type="checkbox"
                      checked={currentCustomers.every(c => selectedCustomers.includes(c._id))}
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
                        onChange={e => handleSelectOne(e, c._id)}
                      />
                    </td>
                    <td>{indexOfFirst + i + 1}</td>
                    <td>{c.srNo}</td>
                    <td>{c.category}</td>
                    <td>{c.name || c.customername}</td>
                    <td>{c.salesPerson}</td>
                    <td>{c.offices}</td>
                    <td>{c.plants}</td>
                    <td>{c.location}</td>
                    <td>{c.contactPerson}</td>
                    <td>{c.department}</td>
                    <td>{c.designation}</td>
                    <td>{c.mobile}</td>
                    <td>{c.email}</td>
                    <td>{c.decision}</td>
                    <td>{c.currentUPS}</td>
                    <td>{c.scopeSRC}</td>
                    <td>{c.racks}</td>
                    <td>{c.cooling}</td>
                    <td>{c.roomAge}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* PAGINATION */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Prev
              </Button>
              <span className="align-self-center">{currentPage} / {totalPages}</span>
              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
