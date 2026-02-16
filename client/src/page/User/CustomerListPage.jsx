import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token missing! Please login again.");
          setCustomers([]);
          return;
        }

        const res = await axios.get("http://localhost:8000/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("CUSTOMER API RESPONSE:", res.data);

        // backend response handle
        let data = [];

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data?.customers && Array.isArray(res.data.customers)) {
          data = res.data.customers;
        } else {
          data = [];
        }

        setCustomers(data);
      } catch (err) {
        console.log("Fetch Customers Error:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          setError("Unauthorized! Please login again.");
        } else if (err.response?.status === 403) {
          setError("Permission denied! You cannot access customers.");
        } else {
          setError(err.response?.data?.message || "Failed to fetch customers.");
        }

        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(c.srNo || "").toLowerCase().includes(searchText) ||
        String(c.mobile || "").toLowerCase().includes(searchText) ||
        String(c.salesPerson || "").toLowerCase().includes(searchText) ||
        String(c.contactPerson || "").toLowerCase().includes(searchText) ||
        String(c.email || "").toLowerCase().includes(searchText) ||
        String(c.category || "").toLowerCase().includes(searchText) ||
        String(c.customername || "").toLowerCase().includes(searchText);

      const matchesCategory = categoryFilter
        ? String(c.category || "") === categoryFilter
        : true;

      const matchesDecision = decisionFilter
        ? String(c.decision || "") === decisionFilter
        : true;

      return matchesSearch && matchesCategory && matchesDecision;
    });
  }, [customers, search, categoryFilter, decisionFilter]);

  const categoryOptions = useMemo(() => {
    return [...new Set(customers.map((c) => c.category).filter(Boolean))];
  }, [customers]);

  const decisionOptions = useMemo(() => {
    return [...new Set(customers.map((c) => c.decision).filter(Boolean))];
  }, [customers]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 fw-bold text-center">Customer List</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-2 fw-bold">Loading Customers...</p>
        </div>
      ) : (
        <>
          <Row className="mb-3">
            <Col md={4} sm={12} className="mb-2">
              <Form.Control
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>

            <Col md={4} sm={6} className="mb-2">
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4} sm={6} className="mb-2">
              <Form.Select
                value={decisionFilter}
                onChange={(e) => setDecisionFilter(e.target.value)}
              >
                <option value="">All Decisions</option>
                {decisionOptions.map((dec) => (
                  <option key={dec} value={dec}>
                    {dec}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th>No.</th>
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c, index) => (
                  <tr key={c._id || index}>
                    <td>{index + 1}</td>
                    <td>{c.srNo || "-"}</td>
                    <td>{c.category || "-"}</td>
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
                    <td>{c.currentUPS || "-"}</td>
                    <td>{c.scopeSRC || "-"}</td>
                    <td>{c.racks || "-"}</td>
                    <td>{c.cooling || "-"}</td>
                    <td>{c.roomAge || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="19" className="text-danger fw-bold">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <p className="text-muted fw-bold">
            Total Customers: {filteredCustomers.length}
          </p>
        </>
      )}
    </Container>
  );
};

export default CustomerList;
