import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [step, setStep] = useState("email"); // email -> otp
  const [loading, setLoading] = useState(false);

  // Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message || "OTP sent to your email." });
        setStep("otp");
      } else {
        setAlert({ type: "danger", message: data.message || "Failed to send OTP." });
      }
    } catch (err) {
      setAlert({ type: "danger", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message || "OTP verified! You can reset your password." });
        // Redirect or show reset password form
      } else {
        setAlert({ type: "danger", message: data.message || "Invalid OTP." });
      }
    } catch (err) {
      setAlert({ type: "danger", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message || "OTP resent successfully." });
      } else {
        setAlert({ type: "danger", message: data.message || "Failed to resend OTP." });
      }
    } catch (err) {
      setAlert({ type: "danger", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Forgot Password</h2>

      {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

      {step === "email" && (
        <Form onSubmit={handleSendOtp}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Enter your registered email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </Form>
      )}

      {step === "otp" && (
        <Form onSubmit={handleVerifyOtp}>
          <Form.Group className="mb-3" controlId="formOtp">
            <Form.Label>Enter OTP sent to your email</Form.Label>
            <Form.Control
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100" disabled={loading}>
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </Button>

          <div className="text-center mt-3">
            Didn't receive OTP?{" "}
            <Button variant="link" onClick={handleResendOtp} disabled={loading}>
              Resend OTP
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
