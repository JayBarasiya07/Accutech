import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <Nav className="flex-column">
        <NavLink className="nav-link" to="/admin/dashboard">Dashboard</NavLink>
        <NavLink className="nav-link" to="/admin/customers">Customers</NavLink>
        <NavLink className="nav-link" to="/admin/orders">Orders</NavLink>
        <NavLink className="nav-link" to="/admin/users">Users</NavLink>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
