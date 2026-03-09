import React from "react";
import { Table, Button, Image, Badge } from "react-bootstrap";

export default function ProductTable({ products, onEdit, onDelete }) {

  return (
    <Table striped bordered hover>

      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Capacity</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {products.map((p) => (

          <tr key={p._id}>

            <td>
              <Image
                src={`http://localhost:8000/${p.images?.[0]}`}
                width={50}
              />
            </td>

            <td>{p.name}</td>
            <td>{p.brand}</td>
            <td>{p.capacity}</td>

            <td>${p.price}</td>

            <td>
              {p.stock > 5 ? (
                <Badge bg="success">{p.stock}</Badge>
              ) : (
                <Badge bg="danger">{p.stock}</Badge>
              )}
            </td>

            <td>

              <Button
                size="sm"
                variant="warning"
                onClick={() => onEdit(p)}
              >
                Edit
              </Button>

              {" "}

              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(p._id)}
              >
                Delete
              </Button>

            </td>

          </tr>

        ))}

      </tbody>

    </Table>
  );
}