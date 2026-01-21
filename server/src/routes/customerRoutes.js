import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

// Protect routes
router.use(authMiddleware);

// Routes
router.get("/", getCustomers);               // get all customers
router.get("/:id", getCustomerById);        // get single customer
router.post("/", createCustomer);           // create customer
router.put("/:id", updateCustomer);         // update customer
router.delete("/:id", deleteCustomer);      // delete customer

export default router;
