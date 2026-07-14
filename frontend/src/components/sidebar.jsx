import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1E3A8A",
        color: "white",
        position: "fixed",
        paddingTop: "20px"
      }}
    >
      <h3 className="text-center mb-4">AI Debt Relief</h3>

      <ul className="nav flex-column">

        <Link className="nav-link text-white" to="/ai">
    <FaRobot /> AI Assistant
        </Link>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/loan">
            <FaMoneyBill /> Loan Management
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/ai">
            <FaRobot /> AI Assistant
          </Link>
        </li>

        <li className="nav-item mt-5">
          <Link className="nav-link text-white" to="/">
            <FaSignOutAlt /> Logout
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;