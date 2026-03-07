import Product from "../models/Product.js";


// =====================
// ADD PRODUCT
// =====================
export const addProduct = async (req, res) => {

  try {

    const product = new Product(req.body);

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ message: "Add product failed" });
  }

};


// =====================
// GET ALL PRODUCTS
// =====================
export const getProducts = async (req, res) => {

  try {

    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }

};


// =====================
// GET PRODUCT DETAILS
// =====================
export const getProductById = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Error loading product" });
  }

};


// =====================
// UPDATE PRODUCT
// =====================
export const updateProduct = async (req, res) => {

  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Product updated",
      product
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }

};


// =====================
// DELETE PRODUCT
// =====================
export const deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product removed" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }

};