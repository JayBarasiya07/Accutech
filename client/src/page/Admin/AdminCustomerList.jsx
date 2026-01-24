// src/pages/Admin/AdminCustomerList.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Col, Row, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminCustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const paginatedData = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
        {i}
      </Pagination.Item>
    );
  }

  const columns = [
    "No","SrNo","Category","CustomerName","SalesPerson","Offices","Plants","Location","ContactPerson",
    "Department","Designation","Mobile","Email","Decision","CurrentUPS","ScopeSRC","Racks",
    "Cooling","RoomAge"
  ];

  return (
    <Row className="g-0">
      {/* Sidebar desktop */}
      <Col md={2} className="d-none d-md-block p-0">
        <AdminSidebar />
      </Col>

      {/* Sidebar mobile */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AdminSidebar />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main content */}
      <Col md={10} className="p-3">
        <div className="d-md-none mb-3">
          <Button onClick={() => setShowSidebar(true)}>☰ Menu</Button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Customer List</h2>
          <Link to="/admin/customers/add">
            <Button variant="success">+ Add New Customer</Button>
          </Link>
        </div>

        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length ? (
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
                    <td className="text-center">
                      <Link to={`/admin/customers/edit/${cust._id}`}>
                        <Button variant="warning" size="sm" className="me-1">Edit</Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(cust._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
            {paginationItems}
          </Pagination>
        )}
      </Col>
    </Row>
  );
};

export default AdminCustomerList;
