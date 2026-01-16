import React from "react";
import { Container, Table, Button } from "react-bootstrap";

const customers = [
  { id: 1, name: "JAy", email: "tech@solutions.com", phone: "9876543210" },
  { id: 2, name: "Mega Corp", email: "contact@megacorp.com", phone: "1234567890" },
];

const AdminCustomerList = () => {
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Customers</h2>
        <Button variant="success">Add Customer</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">Edit</Button>
                <Button variant="danger" size="sm">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminCustomerList;
