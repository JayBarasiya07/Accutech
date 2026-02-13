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
    cooling: "",
    roomAge: "",
  });

  // ================= FETCH CATEGORIES + COOLING + CUSTOMER =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setGeneralError("");

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Categories
        const catRes = await axios.get("http://localhost:8000/api/categories", {
          headers,
        });
        setCategories(catRes.data || []);

        // Fetch Cooling Options
        const coolingRes = await axios.get("http://localhost:8000/api/cooling", {
          headers,
        });
        setCoolings(coolingRes.data || []);

        // Fetch Customer If Edit Mode
        if (id) {
          const custRes = await axios.get(
            `http://localhost:8000/api/customers/${id}`,
            { headers }
          );

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
            cooling: custRes.data.cooling || "",
            roomAge: custRes.data.roomAge || "",
          });
        }
      } catch (err) {
        console.log("Fetch Error:", err);
        setGeneralError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // ================= AUTH CHECK =================
  if (!token) return <Navigate to="/login" replace />;

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
      "roomAge",
    ];

    requiredFields.forEach((field) => {
      if (!customer[field] || customer[field].trim() === "") {
        newErrors[field] = "Required";
      }
    });

    if (customer.mobile && !/^\d{10}$/.test(customer.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    if (customer.email && !/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "Invalid email address";
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
        // UPDATE CUSTOMER
        await axios.put(
          `http://localhost:8000/api/customers/${id}`,
          customer,
          { headers }
        );

        setSuccessMsg("Customer updated successfully ✅");
      } else {
        // ADD CUSTOMER
        await axios.post("http://localhost:8000/api/customers", customer, {
          headers,
        });

        setSuccessMsg("Customer added successfully ✅");
      }

      setTimeout(() => {
        navigate("/superadmin/customers");
      }, 1500);
    } catch (err) {
      console.log("Save Error:", err);
      setGeneralError(err.response?.data?.message || "Save failed!");
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">{id ? "Update Customer" : "Add New Customer"}</h3>

          <Button
            variant="outline-secondary"
            onClick={() => navigate("/superadmin/customers")}
          >
            ← Back to List
          </Button>
        </div>

        {generalError && <Alert variant="danger">{generalError}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              {/* BASIC INFO */}
              <h5 className="fw-bold mb-3">Basic Information</h5>

              <Row className="mb-4">
                <Col md={3}>
                  <Form.Label>Sr No</Form.Label>
                  <Form.Control
                    name="srNo"
                    value={customer.srNo}
                    onChange={handleChange}
                    isInvalid={!!errors.srNo}
                  />
                  <Form.Control.Feedback type="invalid">{errors.srNo}</Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    name="customername"
                    value={customer.customername}
                    onChange={handleChange}
                    isInvalid={!!errors.customername}
                  />
                  <Form.Control.Feedback type="invalid">{errors.customername}</Form.Control.Feedback>
                </Col>
              </Row>

              {/* CONTACT DETAILS */}
              <h5 className="fw-bold mb-3">Contact Details</h5>
              <Row className="mb-4">
                <Col md={4}>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    name="contactPerson"
                    value={customer.contactPerson}
                    onChange={handleChange}
                    isInvalid={!!errors.contactPerson}
                  />
                  <Form.Control.Feedback type="invalid">{errors.contactPerson}</Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    name="mobile"
                    value={customer.mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile}
                  />
                  <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Col>
              </Row>

              {/* OTHER DETAILS */}
              <h5 className="fw-bold mb-3">Other Details</h5>

              <Row className="mb-4">
                <Col md={3}>
                  <Form.Label>Sales Person</Form.Label>
                  <Form.Control
                    name="salesPerson"
                    value={customer.salesPerson}
                    onChange={handleChange}
                    isInvalid={!!errors.salesPerson}
                  />
                  <Form.Control.Feedback type="invalid">{errors.salesPerson}</Form.Control.Feedback>
                </Col>

                <Col md={3}>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    name="location"
                    value={customer.location}
                    onChange={handleChange}
                    isInvalid={!!errors.location}
                  />
                  <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                </Col>

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
              </Row>

              <Row className="mb-4">
                <Col md={4}>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    name="department"
                    value={customer.department}
                    onChange={handleChange}
                    isInvalid={!!errors.department}
                  />
                  <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    name="designation"
                    value={customer.designation}
                    onChange={handleChange}
                    isInvalid={!!errors.designation}
                  />
                  <Form.Control.Feedback type="invalid">{errors.designation}</Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Label>Decision</Form.Label>
                  <Form.Control
                    name="decision"
                    value={customer.decision}
                    onChange={handleChange}
                    isInvalid={!!errors.decision}
                  />
                  <Form.Control.Feedback type="invalid">{errors.decision}</Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
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
                  <Form.Control.Feedback type="invalid">{errors.cooling}</Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label>Room Age</Form.Label>
                  <Form.Control
                    name="roomAge"
                    value={customer.roomAge}
                    onChange={handleChange}
                    isInvalid={!!errors.roomAge}
                  />
                  <Form.Control.Feedback type="invalid">{errors.roomAge}</Form.Control.Feedback>
                </Col>
              </Row>

              {/* BUTTONS */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <Button
                  variant="light"
                  onClick={() => navigate("/superadmin/customers")}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="primary" className="px-4">
                  {id ? "Update Customer" : "Save Customer"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminAddCustomer;
