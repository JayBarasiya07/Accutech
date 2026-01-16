import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message || "Reset link sent to your email." });
        setSent(true);
      } else {
        setAlert({ type: "danger", message: data.message || "Failed to send reset link." });
      }
    } catch (err) {
      setAlert({ type: "danger", message: err.message });
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Forgot Password</h2>

      {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

      {!sent && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Enter your registered email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Send Reset Link
          </Button>
        </Form>
      )}

      {sent && <div className="text-center mt-3">Check your email for the reset link!</div>}
    </Container>
  );
}
