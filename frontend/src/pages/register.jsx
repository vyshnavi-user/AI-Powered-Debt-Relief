import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",
        email: "",
        password: "",
        income: "",
        expenses: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const register = async () => {

        try {

            await api.post("/register", {

                ...form,

                income: Number(form.income),

                expenses: Number(form.expenses)

            });

            alert("Registration Successful");

            navigate("/");

        }

        catch (error) {

            alert(error.response?.data?.detail || "Registration Failed");

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

                {/* Left Panel */}

                <div
                    className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white"
                    style={{
                        background: "linear-gradient(135deg,#1E3A8A,#2563EB)"
                    }}
                >

                    <h1 className="display-5 fw-bold">
                        Join AI Debt Relief
                    </h1>

                    <p className="text-center mt-3 px-5">

                        Create your account to manage loans,
                        analyze your financial health,
                        and receive AI-powered settlement recommendations.

                    </p>

                </div>

                {/* Right Panel */}

                <div
                    className="col-md-6 d-flex justify-content-center align-items-center"
                >

                    <div
                        className="card shadow-lg p-4"
                        style={{
                            width: "450px",
                            borderRadius: "15px"
                        }}
                    >

                        <h2 className="text-center text-primary mb-4">
                            Register
                        </h2>

                        <input
                            className="form-control mb-3"
                            placeholder="Full Name"
                            name="name"
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            type="number"
                            placeholder="Monthly Income"
                            name="income"
                            onChange={handleChange}
                        />

                        <input
                            className="form-control mb-3"
                            type="number"
                            placeholder="Monthly Expenses"
                            name="expenses"
                            onChange={handleChange}
                        />

                        <button
                            className="btn btn-primary w-100"
                            onClick={register}
                        >
                            Create Account
                        </button>

                        <p className="text-center mt-3">

                            Already have an account?

                        </p>

                        <Link
                            to="/"
                            className="btn btn-outline-primary"
                        >
                            Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;