import Customer from "../models/customerModel.js";

// GET all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers); // ✅ always array
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: err.message,
    });
  }
};

// GET customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch customer",
      error: err.message,
    });
  }
};

// CREATE customer
export const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create customer",
      error: err.message,
    });
  }
};

// UPDATE customer
export const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update customer",
      error: err.message,
    });
  }
};

// DELETE customer
export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete customer",
      error: err.message,
    });
  }
};
