import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import ProductTable from "../../components/SuperAdmin/ProductTable";
import ProductFormModal from "../../components/SuperAdmin/ProductFormModal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../components/SuperAdmin/productService";

export default function SuperAdminProducts() {

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");

  // ================= Fetch Products =================
  const fetchProducts = async () => {
    try {
      const res = await getProducts(token);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, []);

  // ================= Add Product =================
  const openAdd = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  // ================= Edit Product =================
  const openEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // ================= Save Product =================
  const saveProduct = async (data) => {

    try {

      if (editProduct) {
        await updateProduct(editProduct._id, data, token);
      } else {
        await createProduct(data, token);
      }

      setShowModal(false);
      fetchProducts();

    } catch (err) {
      console.error("Save failed", err);
    }

  };

  // ================= Delete Product =================
  const removeProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id, token);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }

  };

  // ================= Search =================
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <SuperAdminLayout>

      <Container fluid className="p-4">

        <h3 className="mb-4">Product Management</h3>

        <div className="d-flex justify-content-between mb-3">

          <Form.Control
            placeholder="Search product..."
            style={{ width: "250px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button variant="primary" onClick={openAdd}>
            Add Product
          </Button>

        </div>

        <ProductTable
          products={filtered}
          onEdit={openEdit}
          onDelete={removeProduct}
        />

        <ProductFormModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleSave={saveProduct}
          initialData={editProduct}
        />

      </Container>

    </SuperAdminLayout>

  );
}