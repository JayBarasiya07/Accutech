const KeyAccount = require('../models/KeyAccount.model');

// CREATE
exports.createCustomer = async (req, res) => {
  try {
    const customer = await KeyAccount.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ
exports.getCustomers = async (req, res) => {
  const customers = await KeyAccount.find().sort({ createdAt: -1 });
  res.json(customers);
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  const updated = await KeyAccount.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  await KeyAccount.findByIdAndDelete(req.params.id);
  res.json({ message: 'Customer deleted' });
};
