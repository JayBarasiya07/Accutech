import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";

const SuperAdminAddCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [coolings, setCoolings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [customer, setCustomer] = useState({
    srNo: "",
    category: "",
    customername: "",
    salesPerson: "",
    offices: "",
    plants: "",
    location: "",
    contactPerson: "",
    department: "",
    designation: "",
    mobile: "",
    email: "",
    decision: "",
    currentUPS: "",
    scopeSRC: "",
    racks: "",
    cooling: "",
    roomAge: "",
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setGeneralError("");

        const headers = { Authorization: `Bearer ${token}` };

        const [catRes, coolRes] = await Promise.all([
          axios.get("http://localhost:8000/api/categories", { headers }),
          axios.get("http://localhost:8000/api/cooling", { headers }),
        ]);

        setCategories(catRes.data || []);
        setCoolings(coolRes.data || []);

        // EDIT MODE
        if (id) {
          const custRes = await axios.get(
            `http://localhost:8000/api/customers/${id}`,
            { headers }
          );

          if (!custRes.data) throw new Error("Customer not found!");

          setCustomer({
            srNo: custRes.data.srNo || "",
            category: custRes.data.category || "",
            customername: custRes.data.customername || "",
            salesPerson: custRes.data.salesPerson || "",
            offices: custRes.data.offices || "",
            plants: custRes.data.plants || "",
            location: custRes.data.location || "",
            contactPerson: custRes.data.contactPerson || "",
            department: custRes.data.department || "",
            designation: custRes.data.designation || "",
            mobile: custRes.data.mobile || "",
            email: custRes.data.email || "",
            decision: custRes.data.decision || "",
            currentUPS: custRes.data.currentUPS || "",
            scopeSRC: custRes.data.scopeSRC || "",
            racks: custRes.data.racks || "",
            cooling: custRes.data.cooling || "",
            roomAge: custRes.data.roomAge || "",
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);

        if (err.response?.status === 401) {
          setGeneralError("Token expired. Please login again.");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          setGeneralError(err.response?.data?.message || "Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  // ================= AUTH CHECK =================
  if (!token) return <Navigate to="/login" replace />;

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors = {};

    const requiredFields = [
      "srNo",
      "category",
      "customername",
      "salesPerson",
      "location",
      "contactPerson",
      "department",
      "designation",
      "mobile",
      "email",
      "decision",
      "cooling",
    ];

    requiredFields.forEach((field) => {
      if (!customer[field] || customer[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (customer.mobile && !/^\d{10}$/.test(customer.mobile)) {
      newErrors.mobile = "Enter valid 10-digit mobile number";
    }

    if (customer.email && !/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "Invalid email format";
    }

    if (customer.racks && isNaN(customer.racks)) {
      newErrors.racks = "Racks must be a number";
    }

    return newErrors;
  };

  // ================= HANDLE SUBMIT =================
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
          `http://localhost:8000/api/customers/${id}`,
          customer,
          { headers }
        );
        setSuccessMsg("Customer updated successfully ✅");
      } else {
        await axios.post("http://localhost:8000/api/customers", customer, {
          headers,
        });
        setSuccessMsg("Customer added successfully ✅");
      }

      setTimeout(() => navigate("/superadmin/customers"), 1500);
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);

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
              {id ? "Update Customer" : "Add New Customer"}
            </h3>

            <Button
              variant="secondary"
              className="mb-3"
              onClick={() => navigate("/superadmin/customers")}
            >
              ← Back to Customer List
            </Button>

            {generalError && <Alert variant="danger">{generalError}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Label>Sr No</Form.Label>
                  <Form.Control
                    name="srNo"
                    value={customer.srNo}
                    onChange={handleChange}
                    isInvalid={!!errors.srNo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.srNo}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={customer.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    name="customername"
                    value={customer.customername}
                    onChange={handleChange}
                    isInvalid={!!errors.customername}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.customername}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Sales Person</Form.Label>
                  <Form.Control
                    name="salesPerson"
                    value={customer.salesPerson}
                    onChange={handleChange}
                    isInvalid={!!errors.salesPerson}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salesPerson}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              {/* Row 2 */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Label>Offices</Form.Label>
                  <Form.Control
                    name="offices"
                    value={customer.offices}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3}>
                  <Form.Label>Plants</Form.Label>
                  <Form.Control
                    name="plants"
                    value={customer.plants}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3}>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    name="location"
                    value={customer.location}
                    onChange={handleChange}
                    isInvalid={!!errors.location}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.location}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    name="contactPerson"
                    value={customer.contactPerson}
                    onChange={handleChange}
                    isInvalid={!!errors.contactPerson}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contactPerson}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              {/* Row 3 */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    name="department"
                    value={customer.department}
                    onChange={handleChange}
                    isInvalid={!!errors.department}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.department}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    name="designation"
                    value={customer.designation}
                    onChange={handleChange}
                    isInvalid={!!errors.designation}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.designation}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    name="mobile"
                    value={customer.mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              {/* Row 4 */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Label>Decision</Form.Label>
                  <Form.Control
                    name="decision"
                    value={customer.decision}
                    onChange={handleChange}
                    isInvalid={!!errors.decision}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.decision}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Current UPS</Form.Label>
                  <Form.Control
                    name="currentUPS"
                    value={customer.currentUPS}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3}>
                  <Form.Label>Scope SRC</Form.Label>
                  <Form.Control
                    name="scopeSRC"
                    value={customer.scopeSRC}
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3}>
                  <Form.Label>Racks</Form.Label>
                  <Form.Control
                    name="racks"
                    value={customer.racks}
                    onChange={handleChange}
                    isInvalid={!!errors.racks}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.racks}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              {/* Row 5 */}
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Label>Cooling</Form.Label>
                  <Form.Select
                    name="cooling"
                    value={customer.cooling}
                    onChange={handleChange}
                    isInvalid={!!errors.cooling}
                  >
                    <option value="">Select Cooling</option>
                    {coolings.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.cooling}
                  </Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Room Age</Form.Label>
                  <Form.Control
                    name="roomAge"
                    value={customer.roomAge}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Button type="submit" variant="success">
                {id ? "Update Customer" : "Add Customer"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminAddCustomer;
