import React, { useState, useMemo } from "react";
import { Container, Table, Form, Row, Col } from "react-bootstrap";

// Sample customer data
const initialCustomers = [
  {
    id: 1,
    category: "IT",
    salesPerson: "Rajesh Kumar",
    offices: 3,
    plants: 2,
    location: "Mumbai, Delhi, Bangalore",
    contactPerson: "Amit Sharma",
    department: "IT Infrastructure",
    designation: "IT Manager",
    mobile: "9876543210",
    email: "amit.sharma@techsol.com",
    decision: "Centralised",
    currentUPS: "Yes - APC 10KVA",
    scopeSRC: "High",
    racks: 15,
    cooling: "Precision AC",
    roomAge: "3 years",
  },
  {
    id: 2,
    category: "Manufacturing",
    salesPerson: "Priya Singh",
    offices: 2,
    plants: 4,
    location: "Ahmedabad, Pune",
    contactPerson: "Vikram Joshi",
    department: "Production",
    designation: "Plant Manager",
    mobile: "9876501234",
    email: "vikram.joshi@steelworks.com",
    decision: "Decentralised",
    currentUPS: "No",
    scopeSRC: "Medium",
    racks: 8,
    cooling: "AC Split",
    roomAge: "5 years",
  },
  // Add more customers here...
];

const CleanCustomerList = () => {
  const [customers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("");

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.salesPerson.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
      const matchesDecision = decisionFilter ? c.decision === decisionFilter : true;

      return matchesSearch && matchesCategory && matchesDecision;
    });
  }, [customers, search, categoryFilter, decisionFilter]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Customer List</h2>

      {/* Search and Filters */}
      <Row className="mb-3">
        <Col md={4} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search by sales person, contact, email or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={3} className="mb-2">
          <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {[...new Set(customers.map((c) => c.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={3} className="mb-2">
          <Form.Select value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value)}>
            <option value="">All Decisions</option>
            {[...new Set(customers.map((c) => c.decision))].map((dec) => (
              <option key={dec} value={dec}>
                {dec}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
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
              <tr key={c.id}>
                <td>{index + 1}</td>
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
              <td colSpan="17" className="text-center">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CleanCustomerList;
