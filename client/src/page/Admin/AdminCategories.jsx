import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const CATEGORY_API = "http://localhost:8000/api/categories";
const COOLING_API = "http://localhost:8000/api/cooling";

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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCoolings, setLoadingCoolings] = useState(false);

  const [savingCategory, setSavingCategory] = useState(false);
  const [savingCooling, setSavingCooling] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchCooling, setSearchCooling] = useState("");

  // ---------------- ALERT FUNCTIONS ----------------
  const showSuccess = (msg) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 2500);
  };

  const showError = (msg) => {
    setError(msg);
    setMessage("");
    setTimeout(() => setError(""), 3000);
  };

  // ---------------- LOAD DATA ----------------
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(CATEGORY_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch categories");

      setCategories(data);
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadCoolings = async () => {
    setLoadingCoolings(true);
    try {
      const res = await fetch(COOLING_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch coolings");

      setCoolings(data);
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setLoadingCoolings(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.assign("/login");
      return;
    }

    loadCategories();
    loadCoolings();
  }, []);

  // ---------------- FILTER SEARCH ----------------
  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name?.toLowerCase().includes(searchCategory.toLowerCase())
    );
  }, [categories, searchCategory]);

  const filteredCoolings = useMemo(() => {
    return coolings.filter((c) =>
      c.name?.toLowerCase().includes(searchCooling.toLowerCase())
    );
  }, [coolings, searchCooling]);

  // ---------------- CATEGORY CRUD ----------------
  const addCategory = async () => {
    const name = categoryName.trim();

    if (!name) return showError("Category name is required!");

    const exists = categories.some(
      (c) => c.name?.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setCategoryName("");
      return showError("Category already exists!");
    }

    setSavingCategory(true);

    try {
      const res = await fetch(CATEGORY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");

      setCategories((prev) => [data, ...prev]);
      setCategoryName("");

      showSuccess("Category added successfully ✅");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const updateCategory = async () => {
    const name = editCategory?.name?.trim();

    if (!name) return showError("Category name is required!");

    setSavingCategory(true);

    try {
      const res = await fetch(`${CATEGORY_API}/${editCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update category");

      setCategories((prev) =>
        prev.map((c) => (c._id === data._id ? data : c))
      );

      setShowCategoryModal(false);
      setEditCategory(null);

      showSuccess("Category updated successfully ✅");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    setDeletingId(id);

    try {
      const res = await fetch(`${CATEGORY_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete category");

      setCategories((prev) => prev.filter((c) => c._id !== id));
      showSuccess("Category deleted successfully 🗑️");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- COOLING CRUD ----------------
  const addCooling = async () => {
    const name = coolingName.trim();

    if (!name) return showError("Cooling name is required!");

    const exists = coolings.some(
      (c) => c.name?.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      setCoolingName("");
      return showError("Cooling already exists!");
    }

    setSavingCooling(true);

    try {
      const res = await fetch(COOLING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add cooling");

      setCoolings((prev) => [data, ...prev]);
      setCoolingName("");

      showSuccess("Cooling type added successfully ✅");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setSavingCooling(false);
    }
  };

  const updateCooling = async () => {
    const name = editCooling?.name?.trim();

    if (!name) return showError("Cooling name is required!");

    setSavingCooling(true);

    try {
      const res = await fetch(`${COOLING_API}/${editCooling._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update cooling");

      // ✅ FIXED
      setCoolings((prev) =>
        prev.map((c) => (c._id === data._id ? data : c))
      );

      setShowCoolingModal(false);
      setEditCooling(null);

      showSuccess("Cooling type updated successfully ✅");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setSavingCooling(false);
    }
  };

  const deleteCooling = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cooling type?"))
      return;

    setDeletingId(id);

    try {
      const res = await fetch(`${COOLING_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete cooling");

      setCoolings((prev) => prev.filter((c) => c._id !== id));
      showSuccess("Cooling type deleted successfully 🗑️");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="admin-container d-flex">
      <AdminSidebar />

      <div className="admin-content p-3 w-100">
        <h2 className="mb-4 fw-bold text-primary">
          Category & Cooling Management
        </h2>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {/* CATEGORY SECTION */}
          <Col md={6}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h4 className="fw-bold mb-3">Categories</h4>

                <Form className="d-flex mb-3">
                  <Form.Control
                    placeholder="Enter Category Name..."
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />

                  <Button
                    onClick={addCategory}
                    className="ms-2"
                    variant="success"
                    disabled={savingCategory}
                  >
                    {savingCategory ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </Form>

                <Form.Control
                  placeholder="Search category..."
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="mb-3"
                />

                {loadingCategories ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th style={{ width: "150px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((c, i) => (
                          <tr key={c._id}>
                            <td>{i + 1}</td>
                            <td>{c.name}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="warning"
                                className="me-2"
                                onClick={() => {
                                  setEditCategory(c);
                                  setShowCategoryModal(true);
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                disabled={deletingId === c._id}
                                onClick={() => deleteCategory(c._id)}
                              >
                                {deletingId === c._id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No category found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* COOLING SECTION */}
          <Col md={6}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h4 className="fw-bold mb-3">Cooling Types</h4>

                <Form className="d-flex mb-3">
                  <Form.Control
                    placeholder="Enter Cooling Type..."
                    value={coolingName}
                    onChange={(e) => setCoolingName(e.target.value)}
                  />

                  <Button
                    onClick={addCooling}
                    className="ms-2"
                    variant="success"
                    disabled={savingCooling}
                  >
                    {savingCooling ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </Form>

                <Form.Control
                  placeholder="Search cooling..."
                  value={searchCooling}
                  onChange={(e) => setSearchCooling(e.target.value)}
                  className="mb-3"
                />

                {loadingCoolings ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th style={{ width: "150px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoolings.length > 0 ? (
                        filteredCoolings.map((c, i) => (
                          <tr key={c._id}>
                            <td>{i + 1}</td>
                            <td>{c.name}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="warning"
                                className="me-2"
                                onClick={() => {
                                  setEditCooling(c);
                                  setShowCoolingModal(true);
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                disabled={deletingId === c._id}
                                onClick={() => deleteCooling(c._id)}
                              >
                                {deletingId === c._id ? (
                                  <Spinner size="sm" />
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No cooling type found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* CATEGORY MODAL */}
        <Modal
          show={showCategoryModal}
          onHide={() => setShowCategoryModal(false)}
          centered
        >
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
            <Button
              variant="secondary"
              onClick={() => setShowCategoryModal(false)}
            >
              Close
            </Button>

            <Button
              variant="primary"
              onClick={updateCategory}
              disabled={savingCategory}
            >
              {savingCategory ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save"
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* COOLING MODAL */}
        <Modal
          show={showCoolingModal}
          onHide={() => setShowCoolingModal(false)}
          centered
        >
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
            <Button
              variant="secondary"
              onClick={() => setShowCoolingModal(false)}
            >
              Close
            </Button>

            <Button
              variant="primary"
              onClick={updateCooling}
              disabled={savingCooling}
            >
              {savingCooling ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCategories;
