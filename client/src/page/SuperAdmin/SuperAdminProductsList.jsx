import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Stack,
  Badge,
  Form,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Image
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

export default function SuperAdminProductsList() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data || []);

    } catch (err) {

      console.error(err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("Failed to load products");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, []);

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();

    } catch (err) {

      console.error(err);
      alert("Delete failed");

    }
  };

  // ================= SEARCH =================
  const filteredProducts = products.filter((p) => {

    const term = search.toLowerCase();

    return (
      p?.name?.toLowerCase().includes(term) ||
      p?.brand?.toLowerCase().includes(term)
    );

  });

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
      <div className="main-content-area p-4">

        {/* Header */}
        <Row className="align-items-center mb-4 g-3">
          <Col md={6}>
            <h4 className="fw-bold mb-0">Product Management</h4>
            <p className="text-muted small mb-0">
              Manage your inventory and stock levels
            </p>
          </Col>

          <Col md={6} className="text-md-end">
            <Link to="/superadmin/products/add">
              <Button variant="primary" className="px-4 shadow-sm">
                + Add New Product
              </Button>
            </Link>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Search */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={5} lg={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by name or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-light border-0"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Table */}
        <div className="shadow-sm rounded overflow-hidden">

          {filteredProducts.length === 0 ? (

            <div className="text-center p-5 bg-white border">
              <h6 className="text-muted mb-0">No products found</h6>
            </div>

          ) : (

            <Table hover responsive className="align-middle bg-white mb-0">

              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((p) => {

                  const price = Number(p?.price) || 0;
                  const stock = Number(p?.stock) || 0;

                  return (
                    <tr key={p._id}>

                      {/* IMAGE */}
                      <td style={{ width: "80px" }}>
                        <Image
                          src={
                            p?.images?.length
                              ? `http://localhost:8000/${p.images[0]}`
                              : "/no-image.png"
                          }
                          rounded
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover"
                          }}
                        />
                      </td>

                      {/* NAME */}
                      <td className="fw-bold">
                        {p?.name}
                      </td>

                      {/* BRAND */}
                      <td>{p?.brand}</td>

                      {/* CAPACITY */}
                      <td>{p?.capacity}</td>

                      {/* PRICE */}
                      <td className="fw-bold">
                        ₹{price.toLocaleString("en-IN")}
                      </td>

                      {/* STOCK */}
                      <td>
                        <Badge
                          pill
                          bg={
                            stock === 0
                              ? "secondary"
                              : stock < 10
                              ? "danger"
                              : "success"
                          }
                        >
                          {stock === 0 ? "Out" : stock}
                        </Badge>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <Stack
                          direction="horizontal"
                          gap={2}
                          className="justify-content-center"
                        >

                          <Button
                            variant="light"
                            size="sm"
                            className="border"
                            onClick={() =>
                              navigate(`/superadmin/products/view/${p._id}`)
                            }
                          >
                            View
                          </Button>

                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() =>
                              navigate(`/superadmin/products/edit/${p._id}`)
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </Button>

                        </Stack>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </Table>

          )}

        </div>

      </div>
    </SuperAdminLayout>
  );
}