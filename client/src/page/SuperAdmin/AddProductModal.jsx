import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Card, Image } from "react-bootstrap";
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

  const [imagePreview, setImagePreview] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    capacity: "",
    price: "",
    stock: "",
    image: null
  });

  // ================= FETCH PRODUCT =================
  useEffect(() => {

    const fetchProduct = async () => {

      if (!token) return;

      try {

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
            image: null
          });

          if (res.data.images?.length) {
            setImagePreview(`http://localhost:8000/${res.data.images[0]}`);
          }

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

  if (!token) return <Navigate to="/login" replace />;

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

  };

  // ================= HANDLE IMAGE =================
const handleImageChange = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setErrors((prev) => ({
      ...prev,
      image: "Only JPG, PNG, WEBP allowed"
    }));
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setErrors((prev) => ({
      ...prev,
      image: "Image must be less than 2MB"
    }));
    return;
  }

  setProduct((prev) => ({
    ...prev,
    image: file
  }));

  setImagePreview(URL.createObjectURL(file));

  setErrors((prev) => ({
    ...prev,
    image: ""
  }));
};

  // ================= VALIDATION =================
const validate = () => {

  const newErrors = {};

  if (!product.name.trim())
    newErrors.name = "Product name required";

  if (!product.brand.trim())
    newErrors.brand = "Brand required";

  if (!product.capacity.trim())
    newErrors.capacity = "Capacity required";

  if (!product.price)
    newErrors.price = "Price required";
  else if (Number(product.price) <= 0)
    newErrors.price = "Price must be greater than 0";

  if (!product.stock)
    newErrors.stock = "Stock required";
  else if (Number(product.stock) < 0)
    newErrors.stock = "Stock must be 0 or more";

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

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      };
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("capacity", product.capacity);
      formData.append("price", product.price);
      formData.append("stock", product.stock);

      if (product.image) {
        formData.append("image", product.image);
      }

      if (id) {

        await axios.put(
          `http://localhost:8000/api/products/${id}`,
          formData,
          { headers }
        );

        setSuccessMsg("Product updated successfully ✅");

      } else {

        await axios.post(
          "http://localhost:8000/api/products",
          formData,
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
        <Spinner animation="border" />
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
              ← Back
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
                    {errors.name}
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

              {/* IMAGE UPLOAD */}
              <Row className="mb-4">

                <Col md={6}>
                  <Form.Label>Product Image</Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                  

                </Col>

                <Col md={6} className="text-center">

                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      rounded
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        marginTop: "10px"
                      }}
                    />
                  )}

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