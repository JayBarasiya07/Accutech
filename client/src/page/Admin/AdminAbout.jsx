import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Offcanvas, Alert, Form } from "react-bootstrap";
import axios from "axios";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminAbout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [aboutData, setAboutData] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [newTitle, setNewTitle] = useState(""); 
  const [newDesc, setNewDesc] = useState("");  

  const token = localStorage.getItem("token");

  // Fetch all sections
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/about", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAboutData(res.data);
      } catch (error) {
        console.error(error);
        setAlert({ type: "danger", message: "Failed to fetch data" });
      }
    };
    fetchAboutData();
  }, [token]);

  // Insert new section
  const handleInsert = async () => {
    if (!newTitle || !newDesc) return setAlert({ type: "danger", message: "Title and Description required!" });

    try {
      const res = await axios.post(
        "http://localhost:8000/api/about",
        { title: newTitle, description: newDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAboutData(prev => [...prev, res.data]);
      setAlert({ type: "success", message: "Section added successfully!" });
      setNewTitle("");
      setNewDesc("");
    } catch (error) {
      console.error(error);
      setAlert({ type: "danger", message: "Failed to insert section" });
    }
  };

  // Update section inline
  const handleUpdate = async (id, title, description) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/about/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAboutData(prev => prev.map(item => (item._id === id ? res.data : item)));
      setAlert({ type: "success", message: "Section updated successfully!" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "danger", message: "Failed to update section" });
    }
  };

  // Delete section
  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:8000/api/about/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAboutData(prev => prev.filter(item => item._id !== id));
      setAlert({ type: "success", message: "Section deleted successfully!" });
    } catch (error) {
      console.error(error);
      setAlert({ type: "danger", message: "Failed to delete section" });
    }
  };

  return (
    <div className="admin-panel">
      {/* Desktop Sidebar */}
      <div className="d-none d-md-block"><AdminSidebar /></div>

      {/* Mobile Offcanvas */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} responsive="md">
        <Offcanvas.Header closeButton><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
        <Offcanvas.Body><AdminSidebar /></Offcanvas.Body>
      </Offcanvas>

      <div className="admin-content">
        <div className="d-md-none mb-3">
          <Button onClick={() => setShowSidebar(true)}>☰ Menu</Button>
        </div>

        <Container fluid className="admin-about mt-4">
          <h2 className="about-heading text-center mb-4">About Our Organization</h2>

          {alert.message && (
            <Alert variant={alert.type} onClose={() => setAlert({ type: "", message: "" })} dismissible>
              {alert.message}
            </Alert>
          )}

          {/* Add new section */}
          <Card className="mb-4 p-3 shadow-sm">
            <Card.Body>
              <h5>Add New Section</h5>
              <Form.Control 
                placeholder="Title (e.g., Mission, Vision)" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                className="mb-2" 
              />
              <Form.Control 
                as="textarea" 
                placeholder="Description" 
                value={newDesc} 
                onChange={e => setNewDesc(e.target.value)} 
                className="mb-2" 
                rows={3} 
              />
              <Button onClick={handleInsert}>Insert Section</Button>
            </Card.Body>
          </Card>

          {/* Display all sections dynamically */}
          <Row>
            {aboutData.map(section => (
              <Col md={6} sm={12} key={section._id}>
                <Card className="about-card p-3 mb-3 shadow-sm">
                  <Card.Body>
                    <Form.Control 
                      value={section.title} 
                      onChange={e => setAboutData(prev => prev.map(item => 
                        item._id === section._id ? { ...item, title: e.target.value } : item
                      ))} 
                      className="mb-2"
                    />
                    <Form.Control 
                      as="textarea" 
                      value={section.description} 
                      onChange={e => setAboutData(prev => prev.map(item => 
                        item._id === section._id ? { ...item, description: e.target.value } : item
                      ))} 
                      rows={3} 
                      className="mb-2" 
                    />
                    <div className="d-flex gap-2">
                      <Button 
                        variant="warning" 
                        onClick={() => handleUpdate(section._id, section.title, section.description)}
                      >
                        Update
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(section._id)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminAbout;
