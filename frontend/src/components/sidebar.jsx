import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("user_id");

    navigate("/");

  };

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

      <h3 className="text-center mb-4">

        AI Debt Relief

      </h3>

      <ul className="nav flex-column">

        <li className="nav-item">

          <Link
            className="nav-link text-white"
            to="/dashboard"
          >

            <FaHome /> Dashboard

          </Link>

        </li>

        <li className="nav-item">

          <Link
            className="nav-link text-white"
            to="/loan"
          >

            <FaMoneyBill /> Loan Management

          </Link>

        </li>

        <li className="nav-item">

          <Link
            className="nav-link text-white"
            to="/ai"
          >

            <FaRobot /> AI Assistant

          </Link>

        </li>

        <li className="nav-item mt-5">

          <button
            className="btn btn-danger ms-3"
            onClick={logout}
          >

            <FaSignOutAlt /> Logout

          </button>

        </li>

      </ul>

    </div>

  );

}

export default Sidebar;