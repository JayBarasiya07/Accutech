import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const SuperAdminAddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    capacity: "",
    price: "",
    stock: "",
  });

  // ================= FETCH PRODUCT (EDIT MODE) =================
  useEffect(() => {
    const fetchProduct = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        if (id) {
          const res = await axios.get(
            `http://localhost:8000/api/products/${id}`,
            { headers }
          );

          setProduct({
            name: res.data.name || "",
            brand: res.data.brand || "",
            capacity: res.data.capacity || "",
            price: res.data.price || "",
            stock: res.data.stock || "",
          });
        }
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          setGeneralError("Token expired. Please login again.");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setGeneralError("Failed to load product.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, navigate]);

  // ================= AUTH CHECK =================
  if (!token) return <Navigate to="/login" replace />;

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Product name required";
    if (!product.brand.trim()) newErrors.brand = "Brand required";
    if (!product.capacity.trim()) newErrors.capacity = "Capacity required";

    if (!product.price || isNaN(product.price))
      newErrors.price = "Enter valid price";

    if (!product.stock || isNaN(product.stock))
      newErrors.stock = "Enter valid stock";

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setGeneralError("");
    setSuccessMsg("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(
          `http://localhost:8000/api/products/${id}`,
          product,
          { headers }
        );

        setSuccessMsg("Product updated successfully ✅");
      } else {
        await axios.post(
          "http://localhost:8000/api/products",
          product,
          { headers }
        );

        setSuccessMsg("Product added successfully ✅");
      }

      setTimeout(() => navigate("/superadmin/productsList"), 1500);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setGeneralError("Invalid token. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setGeneralError(err.response?.data?.message || "Save failed!");
      }
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="p-4">

        <Card className="shadow-sm border-0">
          <Card.Body>

            <h3 className="fw-bold mb-3">
              {id ? "Update Product" : "Add Product"}
            </h3>

            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => navigate("/superadmin/productsList")}
            >
              ← Back to Product List
            </Button>

            {generalError && <Alert variant="danger">{generalError}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Form onSubmit={handleSubmit}>

              <Row className="mb-3">

                <Col md={4}>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    isInvalid={!!errors.brand}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.brand}
                  </Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    name="capacity"
                    value={product.capacity}
                    onChange={handleChange}
                    isInvalid={!!errors.capacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Col>

              </Row>

              <Row className="mb-3">

                <Col md={6}>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleChange}
                    isInvalid={!!errors.stock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Col>

              </Row>

              <Button type="submit" variant="success">
                {id ? "Update Product" : "Add Product"}
              </Button>

            </Form>

          </Card.Body>
        </Card>

      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminAddProduct;