import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

const AdminAbout = () => {
  return (
    <Container fluid className="mt-4">
      <h2></h2>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="p-3 mb-3">
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text>
                
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 mb-3">
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text>
               
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="p-3 mt-3">
        <Card.Body>
          <Card.Title></Card.Title>
          <Card.Text>
           
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminAbout;
