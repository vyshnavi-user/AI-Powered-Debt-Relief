import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import api from "../api";

function AIAssistant() {

    const userId = localStorage.getItem("user_id");

    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState("");
    const [letter, setLetter] = useState("");
    const [analysis, setAnalysis] = useState({});

    useEffect(() => {

        loadLoans();

        loadAnalysis();

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

    const loadAnalysis = async () => {

        try {

            const response = await api.get(`/analysis/${userId}`);

            setAnalysis(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const generateLetter = async () => {

        if (!selectedLoan) {

            alert("Please select a loan");

            return;

        }

        try {

            const response = await api.post(
                `/generate-letter/${selectedLoan}`
            );

            setLetter(response.data.ai_letter);

        }

        catch (error) {

            alert(error.response?.data?.detail || "Unable to generate AI letter");

        }

    };

    const copyLetter = () => {

        navigator.clipboard.writeText(letter);

        alert("Letter copied successfully.");

    };

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

                    <h2 className="mb-4">
                        AI Financial Assistant
                    </h2>

                    {/* Financial Summary */}

                    <div className="row mb-4">

                        <div className="col-md-3">
                            <div className="card text-bg-success shadow">
                                <div className="card-body">
                                    <h6>Recommended EMI</h6>
                                    <h4>₹{analysis.recommended_emi || 0}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card text-bg-primary shadow">
                                <div className="card-body">
                                    <h6>Debt Ratio</h6>
                                    <h4>{analysis.debt_ratio || 0}%</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card text-bg-warning shadow">
                                <div className="card-body">
                                    <h6>Stress Level</h6>
                                    <h4>{analysis.stress_level}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="card text-bg-info shadow">
                                <div className="card-body">
                                    <h6>Settlement</h6>
                                    <h4>{analysis.recommended_settlement_percent || 0}%</h4>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Loan Selection */}

                    <div className="card shadow p-4">

                        <label className="mb-2">

                            Select Loan

                        </label>

                        <select
                            className="form-select mb-3"
                            value={selectedLoan}
                            onChange={(e) =>
                                setSelectedLoan(e.target.value)
                            }
                        >

                            <option value="">

                                Choose Loan

                            </option>

                            {

                                loans.map((loan) => (

                                    <option
                                        key={loan.loan_id}
                                        value={loan.loan_id}
                                    >

                                        {loan.lender} - {loan.loan_type}

                                    </option>

                                ))

                            }

                        </select>

                        <button
                            className="btn btn-primary"
                            onClick={generateLetter}
                        >

                            Generate AI Negotiation Letter

                        </button>

                    </div>

                    {

                        letter && (

                            <div className="card shadow mt-4 p-4">

                                <div className="d-flex justify-content-between">

                                    <h4>

                                        AI Recommendation

                                    </h4>

                                    <button
                                        className="btn btn-success"
                                        onClick={copyLetter}
                                    >

                                        Copy Letter

                                    </button>

                                </div>

                                <textarea
                                    className="form-control mt-3"
                                    rows="20"
                                    value={letter}
                                    readOnly
                                />

                            </div>

                        )

                    }

                </div>

            </div>

        </>

    );

}

export default AIAssistant;