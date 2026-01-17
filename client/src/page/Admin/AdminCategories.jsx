import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // -------------------------------
  // Fetch categories from backend
  // -------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        const data = await res.json();
        if (isMounted) setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------
  // Add new category
  // -------------------------------
  const addCategory = async () => {
    if (!name.trim()) return; // don't add empty

    try {
      const res = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]); // append new category locally
      setName(""); // clear input
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  // -------------------------------
  // Update existing category
  // -------------------------------
  const updateCategory = async () => {
    if (!editCategory.name.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/categories/${editCategory._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editCategory.name }),
        }
      );

      const updatedCat = await res.json();

      // update local state without re-fetching
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === updatedCat._id ? updatedCat : cat
        )
      );

      setShowModal(false);
      setEditCategory(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // -------------------------------
  // Delete category
  // -------------------------------
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "DELETE",
      });

      // remove from local state
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <h3>Manage Categories</h3>

      {/* Add new category */}
      <Form className="d-flex mb-3">
        <Form.Control
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="ms-2" onClick={addCategory}>
          Add
        </Button>
      </Form>

      {/* Categories Table */}
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
              <Button className="mt-3" onClick={updateCategory}>
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
