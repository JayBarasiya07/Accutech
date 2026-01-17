// src/pages/AdminCustomerList.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminCustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete customer
  const handleDelete = (id) => {
    navigate(`/admin/customers/delete/${id}`);
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
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  const columns = [
    "No","SrNo","Category","SalesPerson","Offices","Plants","Location","ContactPerson",
    "Department","Designation","Mobile","Email","Decision","CurrentUPS","ScopeSRC","Racks",
    "Cooling","RoomAge"
  ];

  return (
    <Row className="g-0">
      {/* Sidebar */}
      <Col md={2} className="bg-light min-vh-100">
        <AdminSidebar />
      </Col>

      {/* Main Content */}
      <Col md={10} className="p-4">
        <h2>Customer List</h2>

        {/* Add New Customer */}
        <div className="mb-3 text-end">
          <Link to="/admin/customers/add">
            <Button variant="success">+ Add New Customer</Button>
          </Link>
        </div>

        {/* Customer Table */}
        <Table striped bordered hover responsive>
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
                  <td>{idx + 1}</td>
                  <td>{cust.srNo || "-"}</td>
                  <td>{cust.category || "-"}</td>
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
                  <td>
                    <Link to={`/admin/customers/edit/${cust._id}`}>
                      <Button variant="warning" size="sm" className="me-2 mb-1">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(cust._id)}
                    >
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

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center">{paginationItems}</Pagination>
        )}
      </Col>
    </Row>
  );
};

export default AdminCustomerList;
