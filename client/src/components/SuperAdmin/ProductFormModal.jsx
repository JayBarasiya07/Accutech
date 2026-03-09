import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";

export default function ProductFormModal({
  show,
  handleClose,
  handleSave,
  initialData
}) {

  const [form, setForm] = useState({
    name: "",
    brand: "",
    capacity: "",
    price: "",
    stock: "",
    image: null
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const submit = () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">

      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Edit Product" : "Add Product"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Row>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                name="brand"
                value={form.brand}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

        </Row>

        <Row className="mt-3">

          <Col md={6}>
            <Form.Group>
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

        </Row>

        <Row className="mt-3">

          <Col md={6}>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImage} />
            </Form.Group>
          </Col>

        </Row>

        {preview && (
          <div className="mt-3 text-center">
            <Image src={preview} width={120} />
          </div>
        )}

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button variant="warning" onClick={submit}>
          Save Product
        </Button>
      </Modal.Footer>

    </Modal>
  );
}