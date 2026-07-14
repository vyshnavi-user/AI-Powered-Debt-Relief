import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("user_id", response.data.user_id);

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.detail || "Login Failed");
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ minHeight: "100vh", background: "#EEF4FF" }}
    >
      <div className="row vh-100">

        {/* Left Section */}

        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
          style={{
            background: "linear-gradient(135deg,#1E3A8A,#2563EB)"
          }}
        >
          <h1 className="display-5 fw-bold text-center">
            AI Powered Debt Relief
          </h1>

          <h4 className="text-center">
            & Financial Recovery Platform
          </h4>

          <p className="mt-4 text-center px-5">
            Manage your loans, analyze financial health,
            generate AI-powered settlement strategies and
            create professional negotiation letters.
          </p>

        </div>

        {/* Right Section */}

        <div
          className="col-md-6 d-flex justify-content-center align-items-center"
        >

          <div
            className="card shadow-lg p-4"
            style={{
              width: "420px",
              borderRadius: "15px"
            }}
          >

            <h2 className="text-center text-primary mb-4">
              Login
            </h2>

            <input
              className="form-control mb-3"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="form-control mb-3"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-100"
              onClick={login}
            >
              Login
            </button>

            <p className="text-center mt-3">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="btn btn-outline-primary"
            >
              Register
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;