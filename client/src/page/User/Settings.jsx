// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
      setName(userObj.name);
      setEmail(userObj.email);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !email) {
      setAlert({ type: "danger", message: "Name and email are required." });
      return;
    }

    const updatedUser = { ...user, name, email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setAlert({ type: "success", message: "Settings updated successfully!" });
  };

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h2>Please login to access settings</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">Settings</h3>

      {alert.message && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Form onSubmit={handleSave}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default Settings;
