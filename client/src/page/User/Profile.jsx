import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch profile
 useEffect(() => {
  if (!token) {
    setMsg("You are not logged in");
    setLoading(false);
    return;
  }

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile data:", res.data); // debug here
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data || err);
      setMsg(err.response?.data?.message || "Profile load failed");
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token]);


  // Update profile
  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/profile",
        {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEdit(false);
      setMsg("Profile updated successfully");
    } catch (error) {
      console.error(error);
      setMsg("Profile update failed");
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      await axios.put(
        "http://localhost:8000/api/profile/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOldPassword("");
      setNewPassword("");
      setMsg("Password changed successfully");
    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || "Password change failed");
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">{user.name?.charAt(0)}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.mobile}</p>
        </div>

        <div className="profile-body">
          {msg && <div className="alert">{msg}</div>}

          <label>Name</label>
          <input
            type="text"
            value={user.name || ""}
            disabled={!edit}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <label>Mobile</label>
          <input
            type="text"
            value={user.mobile || ""}
            disabled={!edit}
            onChange={(e) => setUser({ ...user, mobile: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            value={user.email || ""}
            disabled={!edit}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          {!edit ? (
            <button className="btn primary" onClick={() => setEdit(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <button className="btn success" onClick={updateProfile}>
              💾 Save Changes
            </button>
          )}

          <div className="divider" />

          <h4>Change Password 🔐</h4>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn warning" onClick={changePassword}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
