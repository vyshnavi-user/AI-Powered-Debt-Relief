import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const login = async () => {

        if (!email.trim() || !password.trim()) {

            alert("Please enter Email and Password");

            return;

        }

        try {

            setLoading(true);

            console.log("Sending Login Request...");

            const response = await api.post("/login", {

                email: email.trim(),

                password: password.trim()

            });

            console.log("Login Response:", response.data);

            localStorage.setItem("user_id", response.data.user_id);

            localStorage.setItem("user_name", response.data.name);

            alert("Login Successful");

            navigate("/dashboard");

        }

        catch (error) {

            console.log(error);

            console.log(error.response);

            alert(

                error.response?.data?.detail ||

                "Unable to Login"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div
            className="container-fluid"
            style={{
                minHeight: "100vh",
                background: "#EEF4FF"
            }}
        >

            <div className="row vh-100">

                {/* Left Side */}

                <div
                    className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
                    style={{
                        background:
                            "linear-gradient(135deg,#1E3A8A,#2563EB)"
                    }}
                >

                    <h1 className="display-4 fw-bold">

                        AI Powered Debt Relief

                    </h1>

                    <h4>

                        Financial Recovery Platform

                    </h4>

                    <p className="text-center mt-4 px-5">

                        Manage Loans

                        <br />

                        Analyze Financial Health

                        <br />

                        AI Debt Negotiation

                        <br />

                        Smart EMI Recommendation

                    </p>

                </div>

                {/* Right Side */}

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

                            type="email"

                            className="form-control mb-3"

                            placeholder="Enter Email"

                            value={email}

                            onChange={(e) =>

                                setEmail(e.target.value)

                            }

                        />

                        <input

                            type="password"

                            className="form-control mb-3"

                            placeholder="Enter Password"

                            value={password}

                            onChange={(e) =>

                                setPassword(e.target.value)

                            }

                        />

                        <button

                            className="btn btn-primary w-100"

                            onClick={login}

                            disabled={loading}

                        >

                            {

                                loading

                                    ? "Logging in..."

                                    : "Login"

                            }

                        </button>

                        <hr />

                        <p className="text-center">

                            Don't have an account?

                        </p>

                        <Link

                            className="btn btn-outline-primary"

                            to="/register"

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