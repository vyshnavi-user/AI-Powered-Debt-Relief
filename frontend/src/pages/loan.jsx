
import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import api from "../api";

function Loan() {
    const userId = localStorage.getItem("user_id");

    const [form, setForm] = useState({
        lender: "",
        loan_type: "",
        original_amount: "",
        outstanding: "",
        emi: "",
        overdue: "",
        interest_rate: "",
        start_date: "",
        end_date: ""
    });

    const [loans, setLoans] = useState([]);
    const [recommendedEmi, setRecommendedEmi] = useState(0);
    const [estimatedEmi, setEstimatedEmi] = useState(null);
    const [duration, setDuration] = useState(0);
    const [closureDate, setClosureDate] = useState("");

    // ==========================================
    // LOAD FINANCIAL ANALYSIS
    // ==========================================

    const loadFinancialAnalysis = useCallback(async () => {
        try {
            if (!userId) return;

            const response = await api.get(`/analysis/${userId}`);

            setRecommendedEmi(
                Number(response.data.recommended_emi) || 0
            );

        } catch (err) {
            console.error("Unable to load financial analysis:", err);
        }
    }, [userId]);

    // ==========================================
    // LOAD USER LOANS
    // ==========================================

    const loadLoans = useCallback(async () => {
        try {
            if (!userId) return;

            const response = await api.get("/loans");

            const userLoans = response.data.filter(
                loan => Number(loan.user_id) === Number(userId)
            );

            setLoans(userLoans);

        } catch (err) {
            console.error("Unable to load loans:", err);
        }
    }, [userId]);

    // ==========================================
    // INITIAL DATA LOADING
    // ==========================================

    useEffect(() => {
        loadFinancialAnalysis();
        loadLoans();
    }, [loadFinancialAnalysis, loadLoans]);

    // ==========================================
    // CALCULATE LOAN DURATION
    // ==========================================

    useEffect(() => {
        if (form.start_date && form.end_date) {
            const start = new Date(form.start_date);
            const end = new Date(form.end_date);

            const months =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());

            if (months > 0) {
                setDuration(months);

                const close = new Date();
                close.setMonth(close.getMonth() + months);

                setClosureDate(close.toLocaleDateString("en-IN"));
            } else {
                setDuration(0);
                setClosureDate("Invalid dates");
            }
        } else {
            setDuration(0);
            setClosureDate("");
        }
    }, [form.start_date, form.end_date]);

    // ==========================================
    // CALCULATE LOAN-BASED EMI
    // ==========================================

    useEffect(() => {
        const principal = Number(form.outstanding);
        const annualRate = Number(form.interest_rate);

        if (
            !form.outstanding ||
            form.interest_rate === "" ||
            principal <= 0 ||
            annualRate < 0 ||
            duration <= 0
        ) {
            setEstimatedEmi(null);
            return;
        }

        const monthlyRate = annualRate / 12 / 100;

        let emi;

        if (monthlyRate === 0) {
            emi = principal / duration;
        } else {
            const factor = Math.pow(1 + monthlyRate, duration);

            emi =
                (principal * monthlyRate * factor) /
                (factor - 1);
        }

        setEstimatedEmi(
            Number.isFinite(emi) ? Math.round(emi) : null
        );

    }, [form.outstanding, form.interest_rate, duration]);

    // ==========================================
    // HANDLE FORM INPUTS
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ==========================================
    // ADD LOAN
    // ==========================================

    const addLoan = async () => {
        try {
            if (!userId) {
                alert("Please log in again.");
                return;
            }

            if (
                !form.lender ||
                !form.loan_type ||
                !form.original_amount ||
                !form.outstanding ||
                form.emi === "" ||
                form.interest_rate === "" ||
                !form.start_date ||
                !form.end_date
            ) {
                alert("Please fill in all loan details.");
                return;
            }

            const originalAmount = Number(form.original_amount);
            const outstandingAmount = Number(form.outstanding);

            if (
                originalAmount <= 0 ||
                outstandingAmount <= 0 ||
                outstandingAmount > originalAmount
            ) {
                alert(
                    "Please enter valid amounts. Outstanding amount cannot exceed original loan amount."
                );
                return;
            }

            if (
                Number(form.emi) < 0 ||
                Number(form.interest_rate) < 0 ||
                Number(form.overdue || 0) < 0
            ) {
                alert("EMI, interest rate and overdue months cannot be negative.");
                return;
            }

            if (duration <= 0) {
                alert("Please select valid loan dates.");
                return;
            }

            const analysis = await api.get(`/analysis/${userId}`);

            const currentRecommendedEmi =
                Number(analysis.data.recommended_emi) || 0;

            setRecommendedEmi(currentRecommendedEmi);

            const payload = {
                user_id: Number(userId),
                lender: form.lender,
                loan_type: form.loan_type,
                original_amount: originalAmount,
                outstanding: outstandingAmount,
                emi: Number(form.emi),
                overdue: Number(form.overdue || 0),
                interest_rate: Number(form.interest_rate),
                start_date: form.start_date,
                end_date: form.end_date,
                duration_months: duration,
                recommended_emi: currentRecommendedEmi,
                expected_closure_date: form.end_date
            };

            await api.post("/loan", payload);

            alert(
                `Loan Added Successfully!\n` +
                `Original Amount: ₹${originalAmount.toLocaleString("en-IN")}\n` +
                `Outstanding Amount: ₹${outstandingAmount.toLocaleString("en-IN")}\n` +
                `Affordable EMI: ₹${currentRecommendedEmi.toLocaleString("en-IN")}\n` +
                `Estimated Loan EMI: ₹${estimatedEmi?.toLocaleString("en-IN") || "N/A"}`
            );

            setForm({
                lender: "",
                loan_type: "",
                original_amount: "",
                outstanding: "",
                emi: "",
                overdue: "",
                interest_rate: "",
                start_date: "",
                end_date: ""
            });

            setEstimatedEmi(null);

            await loadFinancialAnalysis();
            await loadLoans();

        } catch (err) {
            console.error("Add Loan Error:", err);

            alert(
                err.response?.data?.detail ||
                "Unable to Add Loan"
            );
        }
    };

    // ==========================================
    // DELETE LOAN
    // ==========================================

    const deleteLoan = async (id) => {
        if (!window.confirm("Are you sure you want to delete this loan?")) {
            return;
        }

        try {
            await api.delete(`/loan/${id}`);

            alert("Loan Deleted Successfully");

            await loadLoans();
            await loadFinancialAnalysis();

        } catch (err) {
            console.error("Delete Loan Error:", err);
            alert("Unable to delete loan");
        }
    };

    // ==========================================
    // USER INTERFACE
    // ==========================================

    const money = (amount) =>
        Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });

    const comparisonReady = estimatedEmi !== null;

    return (
        <>
            <Navbar />

            <div className="d-flex">
                <Sidebar />

                <div
                    className="container-fluid"
                    style={{
                        marginLeft: "260px",
                        padding: "30px"
                    }}
                >
                    <h2 className="mb-4">Loan Management</h2>

                    {/* LOAN FORM */}

                    <div className="card shadow p-4">
                        <div className="row">

                            <div className="col-md-6">
                                <label>Lender</label>
                                <input
                                    type="text"
                                    name="lender"
                                    className="form-control mb-3"
                                    value={form.lender}
                                    onChange={handleChange}
                                    placeholder="Enter lender name"
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Loan Type</label>
                                <select
                                    name="loan_type"
                                    className="form-control mb-3"
                                    value={form.loan_type}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Loan Type</option>
                                    <option>Home Loan</option>
                                    <option>Personal Loan</option>
                                    <option>Education Loan</option>
                                    <option>Vehicle Loan</option>
                                    <option>Credit Card</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label>Original Loan Amount (₹)</label>
                                <input
                                    type="number"
                                    name="original_amount"
                                    className="form-control mb-3"
                                    value={form.original_amount}
                                    onChange={handleChange}
                                    placeholder="Enter original borrowed amount"
                                    min="1"
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Current Outstanding Amount (₹)</label>
                                <input
                                    type="number"
                                    name="outstanding"
                                    className="form-control mb-3"
                                    value={form.outstanding}
                                    onChange={handleChange}
                                    placeholder="Enter remaining loan amount"
                                    min="1"
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Monthly EMI (Current)</label>
                                <input
                                    type="number"
                                    name="emi"
                                    className="form-control mb-3"
                                    value={form.emi}
                                    onChange={handleChange}
                                    placeholder="Enter current EMI"
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Interest Rate (%)</label>
                                <input
                                    type="number"
                                    name="interest_rate"
                                    className="form-control mb-3"
                                    value={form.interest_rate}
                                    onChange={handleChange}
                                    placeholder="Enter interest rate"
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Overdue Months</label>
                                <input
                                    type="number"
                                    name="overdue"
                                    className="form-control mb-3"
                                    value={form.overdue}
                                    onChange={handleChange}
                                    placeholder="Enter overdue months"
                                    min="0"
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Loan Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    className="form-control mb-3"
                                    value={form.start_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label>Loan End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    className="form-control mb-3"
                                    value={form.end_date}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <hr />

                        {/* EMI CALCULATIONS */}

                        <h4 className="mb-3">EMI Analysis</h4>

                        <div className="row">

                            <div className="col-md-6">
                                <div className="alert alert-success h-100">
                                    <h5>Affordable EMI</h5>

                                    <h3>
                                        ₹{money(recommendedEmi)}
                                    </h3>

                                    <small>
                                        Based on 70% of your monthly surplus
                                        (income minus expenses).
                                    </small>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="alert alert-primary h-100">
                                    <h5>Estimated Loan EMI</h5>

                                    <h3>
                                        {comparisonReady
                                            ? `₹${money(estimatedEmi)}`
                                            : "Enter loan details"}
                                    </h3>

                                    <small>
                                        Calculated from outstanding amount,
                                        interest rate and repayment duration.
                                    </small>
                                </div>
                            </div>

                        </div>

                        {/* EMI COMPARISON */}

                        {comparisonReady && (
                            <div className={`alert ${
                                recommendedEmi >= estimatedEmi
                                    ? "alert-success"
                                    : "alert-warning"
                            }`}>
                                <h5>EMI Affordability Comparison</h5>

                                {recommendedEmi >= estimatedEmi ? (
                                    <p className="mb-0">
                                        Your estimated loan EMI is within
                                        your calculated affordable EMI.
                                        Remaining monthly amount:
                                        {" "}
                                        <strong>
                                            ₹{money(recommendedEmi - estimatedEmi)}
                                        </strong>.
                                    </p>
                                ) : (
                                    <p className="mb-0">
                                        Your estimated loan EMI is higher
                                        than your calculated affordable EMI.
                                        Monthly shortfall:
                                        {" "}
                                        <strong>
                                            ₹{money(estimatedEmi - recommendedEmi)}
                                        </strong>.
                                        Consider a longer repayment period
                                        or reviewing the loan terms.
                                    </p>
                                )}
                            </div>
                        )}

                        {!comparisonReady && (
                            <p className="text-muted">
                                Enter the outstanding amount, interest rate,
                                and valid loan dates to calculate and compare
                                the estimated loan EMI.
                            </p>
                        )}

                        {/* DURATION AND CLOSURE */}

                        <div className="row mt-2">

                            <div className="col-md-6">
                                <div className="alert alert-info">
                                    <h5>Loan Duration</h5>
                                    <h3>{duration} Months</h3>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="alert alert-warning">
                                    <h5>Expected Closure</h5>
                                    <h4>{closureDate || "Select dates"}</h4>
                                </div>
                            </div>

                        </div>

                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={addLoan}
                        >
                            Save Loan
                        </button>

                    </div>

                    {/* LOAN LIST */}

                    <h3 className="mt-5">My Loans</h3>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover mt-3">

                            <thead className="table-dark">
                                <tr>
                                    <th>Lender</th>
                                    <th>Type</th>
                                    <th>Original Amount</th>
                                    <th>Outstanding</th>
                                    <th>Current EMI</th>
                                    <th>Interest</th>
                                    <th>Duration</th>
                                    <th>Affordable EMI</th>
                                    <th>Closure</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loans.length > 0 ? (
                                    loans.map((loan) => (
                                        <tr key={loan.loan_id}>
                                            <td>{loan.lender}</td>
                                            <td>{loan.loan_type}</td>

                                            <td>
                                                ₹{money(loan.original_amount)}
                                            </td>

                                            <td>
                                                ₹{money(loan.outstanding)}
                                            </td>

                                            <td>
                                                ₹{money(loan.emi)}
                                            </td>

                                            <td>{loan.interest_rate}%</td>

                                            <td>
                                                {loan.duration_months} Months
                                            </td>

                                            <td>
                                                ₹{money(loan.recommended_emi)}
                                            </td>

                                            <td>
                                                {loan.expected_closure_date}
                                            </td>

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
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">
                                            No loans added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Loan;
