import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Alert, Spinner } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminCategories = () => {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [coolings, setCoolings] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [coolingName, setCoolingName] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCoolingModal, setShowCoolingModal] = useState(false);

  const [editCategory, setEditCategory] = useState(null);
  const [editCooling, setEditCooling] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    if (!token) return window.location.assign("/login");

    try {
      const [catRes, coolRes] = await Promise.all([
        fetch("http://localhost:8000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/cooling", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!catRes.ok) throw new Error("Failed to fetch categories");
      if (!coolRes.ok) throw new Error("Failed to fetch coolings");

      const catData = await catRes.json();
      const coolData = await coolRes.json();

      setCategories(catData);
      setCoolings(coolData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- CATEGORY CRUD ----------------
  const addCategory = async () => {
    if (!categoryName.trim()) return setError("Category required");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");

      setCategories([data, ...categories]);
      setCategoryName("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    if (!editCategory?.name.trim()) return setError("Category required");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/categories/${editCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editCategory.name }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update category");

      setCategories(categories.map((c) => (c._id === data._id ? data : c)));
      setShowCategoryModal(false);
      setEditCategory(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- COOLING CRUD ----------------
  const addCooling = async () => {
    if (!coolingName.trim()) return setError("Cooling required");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/cooling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: coolingName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add cooling");

      setCoolings([data, ...coolings]);
      setCoolingName("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCooling = async () => {
    if (!editCooling?.name.trim()) return setError("Cooling required");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/cooling/${editCooling._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: editCooling.name }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update cooling");

      setCoolings(coolings.map((c) => (c._id === data._id ? data : c)));
      setShowCoolingModal(false);
      setEditCooling(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCooling = async (id) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/cooling/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete cooling");
      }

      setCoolings(coolings.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
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
          <Button
            onClick={addCategory}
            className="ms-2 btn-success"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Add"}
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
                    disabled={loading}
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
          <Button
            onClick={addCooling}
            className="ms-2 btn-success"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Add"}
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
                    disabled={loading}
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
            <Button variant="primary" onClick={updateCategory} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Save"}
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
            <Button variant="primary" onClick={updateCooling} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;
