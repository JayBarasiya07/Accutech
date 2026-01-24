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
 // Advanced validateForm
const validateForm = () => {
  const { name, email, mobile, password, confirmPassword } = form;

  // ----------- Name Validation -----------
  if (!name.trim()) {
    return { valid: false, message: "Name is required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: "Name must be at least 2 characters long" };
  }

  // ----------- Email Validation -----------
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, message: "Email is required" };
  }
  if (!emailPattern.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }

  // ----------- Mobile Validation -----------
  if (!mobile) {
    return { valid: false, message: "Mobile number is required" };
  }
  if (!/^\d{10}$/.test(mobile)) {
    return { valid: false, message: "Mobile number must be 10 digits" };
  }

  // ----------- Password Validation -----------
  if (!password) {
    return { valid: false, message: "Password is required" };
  }
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  // Stronger password: at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
  if (!strongPassword.test(password)) {
    return { 
      valid: false, 
      message: "Password must contain uppercase, lowercase, number, and special character" 
    };
  }

  // ----------- Confirm Password Validation -----------
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }

  // ----------- All Valid -----------
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
