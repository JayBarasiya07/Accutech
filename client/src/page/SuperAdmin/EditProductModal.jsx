import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function EditProductModal({
  show,
  handleClose,
  productData,
  handleUpdate
}) {

  const [product, setProduct] = useState(productData || {});

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const updateProduct = () => {
    handleUpdate(product);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">

      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product?.name || ""}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={product?.brand || ""}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="text"
                name="capacity"
                value={product?.capacity || ""}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={product?.price || ""}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={product?.stock || ""}
                onChange={handleChange}
              />
            </Col>
          </Row>

        </Form>

      </Modal.Body>

      <Modal.Footer>

        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button variant="warning" onClick={updateProduct}>
          Update Product
        </Button>

      </Modal.Footer>

    </Modal>
  );
}