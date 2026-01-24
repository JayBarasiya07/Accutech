import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";

const AboutPage = () => {
  const [about, setAbout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/about");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setAbout(data);
      } catch (err) {
        setError("Failed to load About page");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return (
    <Container className="mt-5">
      <h2>About Us</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && about.map((item) => (
        <div key={item._id} className="mb-3">
          <h5>{item.title}</h5>
          <p>{item.description}</p>
        </div>
      ))}
    </Container>
  );
};

export default AboutPage;
