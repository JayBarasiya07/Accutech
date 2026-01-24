import React, { useState, useEffect, useMemo } from "react";
import { Container, Table, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const CleanCustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomers(res.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []); // runs once on mount

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.srNo?.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile?.toLowerCase().includes(search.toLowerCase()) ||
        c.ContactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        c.salesPerson?.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase());

      
      const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
      const matchesDecision = decisionFilter ? c.decision === decisionFilter : true;

      return matchesSearch && matchesCategory && matchesDecision;
    });
  }, [customers, search, categoryFilter, decisionFilter]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Customer List</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {[...new Set(customers.map((c) => c.category))].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value)}>
            <option value="">All Decisions</option>
            {[...new Set(customers.map((c) => c.decision))].map((dec) => (
              <option key={dec} value={dec}>{dec}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>No.</th>
            <th>Sr No</th>
            <th>Category</th>
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
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.srNo}</td>
                <td>{c.category}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="17" className="text-center">No customers found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CleanCustomerList;
