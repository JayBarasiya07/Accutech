import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../api";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from location.state or fallback to empty string
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect to home if email is missing (user shouldn't access page directly)
  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      setSuccess(res.data.message || "OTP verified successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-3">Verify OTP</h2>
      <p>Enter the OTP sent to your email: <strong>{email}</strong></p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="form-control mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
