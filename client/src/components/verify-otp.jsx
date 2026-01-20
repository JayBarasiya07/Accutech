import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../api";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Verify OTP</h2>
      <p>Enter the OTP sent to your email: {email}</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="OTP" className="form-control mb-2" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button className="btn btn-primary">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
    