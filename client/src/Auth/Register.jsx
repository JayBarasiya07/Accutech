import { useState } from "react";
import OTP from "../components/OTP"; // OTP verification component
import "../App.css"; // optional for styling

export default function Register({ onNewUser }) {
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // Step state: "register" or "otp"
  const [step, setStep] = useState("register");
  const [userId, setUserId] = useState(null);

  // Alert message
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Form validation
  const validateForm = () => {
    const { name, email, mobile, password, confirmPassword } = form;

    if (name.trim().length < 2)
      return { valid: false, message: "Name must be at least 2 characters" };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
      return { valid: false, message: "Enter a valid email address" };

    if (!/^\d{10}$/.test(mobile))
      return { valid: false, message: "Enter a valid 10-digit mobile number" };

    if (password.length < 6)
      return { valid: false, message: "Password must be at least 6 characters" };

    if (password !== confirmPassword)
      return { valid: false, message: "Passwords do not match" };

    return { valid: true };
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.valid) {
      setAlert({ type: "danger", message: validation.message });
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setAlert({ type: res.ok ? "success" : "danger", message: data.message });

      if (res.ok) {
        setUserId(data.userId);      // save user ID for OTP verification
        setStep("otp");               // switch to OTP page
        setForm({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
      }
    } catch (error) {
      setAlert({ type: "danger", message: "Server error: " + error.message });
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      {step === "register" && (
        <>
          <h2 className="mb-4 text-center">Register</h2>

          {alert.message && (
            <div className={`alert alert-${alert.type}`} role="alert">
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-2"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-3"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary w-100" type="submit">
              Register & Send OTP
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <OTP
          userId={userId}
          onVerified={() => {
            setAlert({ type: "success", message: "Email Verified Successfully 🎉" });
            setStep("register");
            onNewUser && onNewUser(); // optional callback for parent
          }}
        />
      )}
    </div>
  );
}
