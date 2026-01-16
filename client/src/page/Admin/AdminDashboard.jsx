import React from "react";
import { Container, Table, Button } from "react-bootstrap";

// Sample customer data
const customers = [
  {
    id: 1,
    category: "IT",
    name: "Tech Solutions Pvt Ltd",
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
  // Add more customers here...
];

const AdminDashboard = () => {
  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer List</h2>
        <Button variant="success">Add Customer</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td>{c.category}</td>
              <td>{c.name}</td>
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
              <td>
                <Button variant="info" size="sm" className="me-2">
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
