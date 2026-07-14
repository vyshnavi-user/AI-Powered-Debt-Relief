import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import DashboardCard from "../components/dashboardcard";
import api from "../api";

function Dashboard() {

    const [dashboard, setDashboard] = useState({});
    const [analysis, setAnalysis] = useState({});

    const userId = localStorage.getItem("user_id");

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const dashboardResponse = await api.get(`/dashboard/${userId}`);

            const analysisResponse = await api.get(`/analysis/${userId}`);

            setDashboard(dashboardResponse.data);

            setAnalysis(analysisResponse.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <>
            <Navbar />

            <div className="d-flex">

                <Sidebar />

                <div
                    className="container-fluid"
                    style={{
                        marginLeft: "250px",
                        padding: "30px"
                    }}
                >

                    <h2 className="mb-4">

                        Welcome, {dashboard.name}

                    </h2>

                    <div className="row">

                        <DashboardCard
                            title="Monthly Income"
                            value={`₹${dashboard.income || 0}`}
                            color="#16a34a"
                        />

                        <DashboardCard
                            title="Monthly Expenses"
                            value={`₹${dashboard.expenses || 0}`}
                            color="#dc2626"
                        />

                        <DashboardCard
                            title="Outstanding Loan"
                            value={`₹${dashboard.total_outstanding || 0}`}
                            color="#2563eb"
                        />

                        <DashboardCard
                            title="Total EMI"
                            value={`₹${dashboard.total_emi || 0}`}
                            color="#9333ea"
                        />

                    </div>

                    <div className="row mt-3">

                        <DashboardCard
                            title="Monthly Surplus"
                            value={`₹${analysis.monthly_surplus || 0}`}
                            color="#0891b2"
                        />

                        <DashboardCard
                            title="Debt Ratio"
                            value={`${analysis.debt_ratio || 0}%`}
                            color="#ea580c"
                        />

                        <DashboardCard
                            title="Stress Level"
                            value={analysis.stress_level || "-"}
                            color="#e11d48"
                        />

                        <DashboardCard
                            title="Settlement"
                            value={`${analysis.recommended_settlement_percent || 0}%`}
                            color="#14b8a6"
                        />

                    </div>

                </div>

            </div>

        </>

    );

}

export default Dashboard;