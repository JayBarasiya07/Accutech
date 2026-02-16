import Customer from "../models/customerModel.js";

// ===============================
// GET ALL CUSTOMERS
// ===============================
export const getAllCustomers = async (req, res) => {
  try {
    let customers;

    if (req.user.role === "superadmin") {
      customers = await Customer.find().sort({ createdAt: -1 });
    } else {
      customers = await Customer.find({ createdBy: req.user._id }).sort({
        createdAt: -1,
      });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================
// GET CUSTOMER BY ID
// ===============================
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Admin can only access own created customer
    if (req.user.role !== "superadmin") {
      if (customer.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================
// CREATE CUSTOMER
// ===============================
export const createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer({
      ...req.body,
      createdBy: req.user._id, // IMPORTANT
    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully ✅",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================
// UPDATE CUSTOMER
// ===============================
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Admin can update only own created customer
    if (req.user.role !== "superadmin") {
      if (customer.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Customer updated successfully ✅",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ===============================
// DELETE CUSTOMER
// ===============================
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Admin can delete only own created customer
    if (req.user.role !== "superadmin") {
      if (customer.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Customer deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
