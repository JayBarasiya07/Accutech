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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAlert({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", form);
      const { token, user } = res.data;

      // Clear previous session
      localStorage.clear();

      // Save new session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      window.dispatchEvent(new Event("storage"));

      setAlert({ type: "success", message: "Login successful!" });

      // Role based redirect
      if (user.role === "superadmin") {
        navigate("/superadmin/dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
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
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between mb-3">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <Button type="submit" className="w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center mt-3">
          <span>Don't have an account?</span>
        </div>

        <Link to="/register">
          <Button variant="outline-primary" className="w-100 mt-2">
            Register
          </Button>
        </Link>
      </Form>
    </Container>
  );
}
