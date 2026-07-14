import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api";

function AIAssistant() {

    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState("");
    const [letter, setLetter] = useState("");

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

            alert("Unable to generate AI letter");

        }

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

                        AI Negotiation Assistant

                    </h2>

                    <div className="card shadow p-4">

                        <label className="mb-2">

                            Select Loan

                        </label>

                        <select
                            className="form-select mb-3"
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

                            Generate AI Letter

                        </button>

                    </div>

                    {

                        letter && (

                            <div
                                className="card shadow mt-4 p-4"
                            >

                                <h4>

                                    AI Recommendation

                                </h4>

                                <textarea
                                    className="form-control mt-3"
                                    rows="18"
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