// src/pages/Login.jsx
import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAlert({ type: "", message: "" }); // reset alert
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", form);

      // Save JWT token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Notify Header to update immediately
      window.dispatchEvent(new Event("storage"));

      // Show success message
      setAlert({ type: "success", message: "Login successful!" });

      // Redirect based on role
      if (res.data.role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });

    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login</h2>

      {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center mb-2">
          <span className="text-muted">Don't have an account?</span>
        </div>

        <Link to="/register">
          <Button variant="outline-primary" className="w-100">
            Register
          </Button>
        </Link>
      </Form>
    </Container>
  );
}
