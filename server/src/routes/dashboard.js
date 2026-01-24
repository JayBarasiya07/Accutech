// import express from "express";
// import { auth } from "../middlewares/auth.js";
// import {
//   superAdminDashboard,
//   adminDashboard,
//   userDashboard,
//   reports
// } from "../controllers/dashboardController.js";

// const router = express.Router();

// // ✅ Pass the function **without parentheses**
// router.get("/superadmin/dashboard", auth(["superadmin"]), superAdminDashboard);
// router.get("/admin/dashboard", auth(["admin"]), adminDashboard);
// router.get("/user/dashboard", auth(["user"]), userDashboard);
// router.get("/reports", auth(["admin","superadmin"]), reports);

// export default router;
