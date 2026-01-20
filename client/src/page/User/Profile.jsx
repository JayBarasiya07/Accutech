// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h2>Please login to view your profile</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card>
        <Card.Header>
          <h3>Profile Details</h3>
        </Card.Header>
        <Card.Body>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role || "User"}</p>
          {/* Add more profile fields if needed */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
