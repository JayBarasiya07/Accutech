import { useState, useEffect } from "react";

export default function OTP({ userId, email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(255); // 255 seconds OTP expiry

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setAlert({ type: "danger", message: "Enter 6-digit OTP" });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await res.json();
      setAlert({ type: res.ok ? "success" : "danger", message: data.message });
      if (res.ok) onVerified && onVerified();
    } catch (error) {
      setAlert({ type: "danger", message: "Server error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setAlert({ type: res.ok ? "success" : "danger", message: data.msg });
      setTimer(255); // reset timer
    } catch (err) {
      setAlert({ type: "danger", message: "Server error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-3">Verify OTP 📧</h3>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}

      <input
        className="form-control mb-3 text-center fs-4"
        type="text"
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      />

      <button
        className="btn btn-success w-100 mb-2"
        onClick={handleVerify}
        disabled={loading || timer <= 0}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center mb-2">
        {timer > 0 ? (
          <span>Expires in: {timer}s</span>
        ) : (
          <span className="text-danger">OTP expired ⏰</span>
        )}
      </div>

      <button
        className="btn btn-link w-100"
        onClick={handleResend}
        disabled={loading}
      >
        Resend OTP
      </button>
    </div>
  );
}
