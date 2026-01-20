import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [coolings, setCoolings] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [coolingName, setCoolingName] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCoolingModal, setShowCoolingModal] = useState(false);

  const [editCategory, setEditCategory] = useState(null);
  const [editCooling, setEditCooling] = useState(null);

  const [error, setError] = useState("");

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, coolRes] = await Promise.all([
          fetch("http://localhost:8000/api/categories"),
          fetch("http://localhost:8000/api/cooling"),
        ]);

        if (!catRes.ok || !coolRes.ok) throw new Error("Failed to fetch data");

        const catData = await catRes.json();
        const coolData = await coolRes.json();

        setCategories(catData);
        setCoolings(coolData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      }
    };

    loadData();
  }, []); // ✅ no synchronous setState warning

  // ---------------- CATEGORY CRUD ----------------
  const addCategory = async () => {
    if (!categoryName.trim()) return setError("Category required");
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      const newCat = await res.json();
      setCategories([newCat, ...categories]);
      setCategoryName("");
    } catch (err) {
      console.error(err);
      setError("Failed to add category");
    }
  };

  const updateCategory = async () => {
    if (!editCategory?.name.trim()) return setError("Category required");
    setError("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/categories/${editCategory._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editCategory.name }),
        }
      );
      const updated = await res.json();
      setCategories(
        categories.map((cat) => (cat._id === updated._id ? updated : cat))
      );
      setShowCategoryModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update category");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((c) => c._id !== id));
    } catch {
      setError("Failed to delete category");
    }
  };

  // ---------------- COOLING CRUD ----------------
  const addCooling = async () => {
    if (!coolingName.trim()) return setError("Cooling required");
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/cooling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: coolingName }),
      });
      if (!res.ok) throw new Error("Failed to add cooling");
      const newCool = await res.json();
      setCoolings([newCool, ...coolings]);
      setCoolingName("");
    } catch {
      setError("Failed to add cooling");
    }
  };

  const updateCooling = async () => {
    if (!editCooling?.name.trim()) return setError("Cooling required");
    setError("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/cooling/${editCooling._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editCooling.name }),
        }
      );
      const updated = await res.json();
      setCoolings(
        coolings.map((c) => (c._id === updated._id ? updated : c))
      );
      setShowCoolingModal(false);
    } catch {
      setError("Failed to update cooling");
    }
  };

  const deleteCooling = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/cooling/${id}`, { method: "DELETE" });
      setCoolings(coolings.filter((c) => c._id !== id));
    } catch {
      setError("Failed to delete cooling");
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="admin-container d-flex">
      <AdminSidebar />
      <div className="admin-content p-3 w-100">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* CATEGORY */}
        <h3>Categories</h3>
        <Form className="d-flex mb-2">
          <Form.Control
            placeholder="Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button onClick={addCategory} className="ms-2 btn-success">
            Add
          </Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      setEditCategory(c);
                      setShowCategoryModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteCategory(c._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* COOLING */}
        <h3 className="mt-4">Cooling Types</h3>
        <Form className="d-flex mb-2">
          <Form.Control
            placeholder="Cooling"
            value={coolingName}
            onChange={(e) => setCoolingName(e.target.value)}
          />
          <Button onClick={addCooling} className="ms-2 btn-success">
            Add
          </Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coolings.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{c.name}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      setEditCooling(c);
                      setShowCoolingModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteCooling(c._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* MODALS */}
        <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              value={editCategory?.name || ""}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: e.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={updateCategory}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCoolingModal} onHide={() => setShowCoolingModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Cooling Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              value={editCooling?.name || ""}
              onChange={(e) =>
                setEditCooling({ ...editCooling, name: e.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCoolingModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={updateCooling}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;
