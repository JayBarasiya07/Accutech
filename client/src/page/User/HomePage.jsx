import React from "react";
import { Container, Button } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container className="text-center mt-5">
      <h1>Welcome to MyApp 🚀</h1>
      <p>Your one-stop solution for everything!</p>
      <Button variant="primary">Get Started</Button>
    </Container>
  );
};

export default HomePage;
