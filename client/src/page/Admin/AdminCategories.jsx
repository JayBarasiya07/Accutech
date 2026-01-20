import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [error, setError] = useState(""); // For validation errors
  const [loading, setLoading] = useState(false); // Optional: show loading state

  // -------------------------------
  // Fetch categories from backend
  // -------------------------------
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // -------------------------------
  // Add new category
  // -------------------------------
  const addCategory = async () => {
    if (!name.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to add category");

      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setName("");
    } catch (err) {
      console.error("Add failed:", err);
      setError("Failed to add category");
    }
  };

  // -------------------------------
  // Update category
  // -------------------------------
  const updateCategory = async () => {
    if (!editCategory.name.trim()) {
      setError("Category name cannot be empty");
      return;
    }
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

      if (!res.ok) throw new Error("Failed to update category");

      const updatedCat = await res.json();
      setCategories((prev) =>
        prev.map((cat) => (cat._id === updatedCat._id ? updatedCat : cat))
      );
      setShowModal(false);
      setEditCategory(null);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update category");
    }
  };

  // -------------------------------
  // Delete category
  // -------------------------------
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <h3>Manage Categories</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Add new category */}
      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
      >
        <Form.Control
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="ms-2 btn-success" type="submit">
          Add
        </Button>
      </Form>

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr key={cat._id}>
                <td>{i + 1}</td>
                <td>{cat.name}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      setEditCategory(cat);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteCategory(cat._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editCategory && (
            <>
              <Form.Control
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
              />
              <Button
                className="mt-3 btn-primary"
                onClick={updateCategory}
              >
                Update
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminCategories;
