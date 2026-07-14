import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import api from "../api";

function Loan() {

    const userId = localStorage.getItem("user_id");

    const [form, setForm] = useState({
        lender: "",
        loan_type: "",
        outstanding: "",
        emi: "",
        overdue: ""
    });

    const [loans, setLoans] = useState([]);

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {

        try {

            const response = await api.get("/loans");

            setLoans(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const addLoan = async () => {

        try {

            await api.post("/loan", {

                user_id: Number(userId),

                lender: form.lender,

                loan_type: form.loan_type,

                outstanding: Number(form.outstanding),

                emi: Number(form.emi),

                overdue: Number(form.overdue)

            });

            alert("Loan Added Successfully");

            setForm({
                lender: "",
                loan_type: "",
                outstanding: "",
                emi: "",
                overdue: ""
            });

            loadLoans();

        }

        catch (error) {

            alert(error.response?.data?.detail || "Unable to add loan");

        }

    };

    const deleteLoan = async (loanId) => {

        if (!window.confirm("Delete this loan?")) return;

        await api.delete(`/loan/${loanId}`);

        loadLoans();

    };

    return (

        <>
            <Navbar />

            <div className="d-flex">

                <Sidebar />

                <div
                    className="container"
                    style={{
                        marginLeft: "270px",
                        marginTop: "30px"
                    }}
                >

                    <h2 className="mb-4">

                        Loan Management

                    </h2>

                    <div className="card p-4 shadow">

                        <div className="row">

                            <div className="col-md-6">

                                <input
                                    className="form-control mb-3"
                                    placeholder="Lender"
                                    value={form.lender}
                                    onChange={(e) =>
                                        setForm({ ...form, lender: e.target.value })
                                    }
                                />

                            </div>

                            <div className="col-md-6">

                                <input
                                    className="form-control mb-3"
                                    placeholder="Loan Type"
                                    value={form.loan_type}
                                    onChange={(e) =>
                                        setForm({ ...form, loan_type: e.target.value })
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <input
                                    className="form-control mb-3"
                                    type="number"
                                    placeholder="Outstanding Amount"
                                    value={form.outstanding}
                                    onChange={(e) =>
                                        setForm({ ...form, outstanding: e.target.value })
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <input
                                    className="form-control mb-3"
                                    type="number"
                                    placeholder="Monthly EMI"
                                    value={form.emi}
                                    onChange={(e) =>
                                        setForm({ ...form, emi: e.target.value })
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <input
                                    className="form-control mb-3"
                                    type="number"
                                    placeholder="Overdue Months"
                                    value={form.overdue}
                                    onChange={(e) =>
                                        setForm({ ...form, overdue: e.target.value })
                                    }
                                />

                            </div>

                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={addLoan}
                        >

                            Add Loan

                        </button>

                    </div>

                    <h3 className="mt-5">

                        My Loans

                    </h3>

                    <table className="table table-bordered table-striped mt-3">

                        <thead className="table-dark">

                            <tr>

                                <th>Lender</th>

                                <th>Loan Type</th>

                                <th>Outstanding</th>

                                <th>EMI</th>

                                <th>Overdue</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                loans.map((loan) => (

                                    <tr key={loan.loan_id}>

                                        <td>{loan.lender}</td>

                                        <td>{loan.loan_type}</td>

                                        <td>₹{loan.outstanding}</td>

                                        <td>₹{loan.emi}</td>

                                        <td>{loan.overdue_months}</td>

                                        <td>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteLoan(loan.loan_id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}

export default Loan;