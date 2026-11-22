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
    console.log("User ID:", userId);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
        console.log("Loading Dashboard...");

        const dashboardResponse = await api.get(`/dashboard/${userId}`);
        console.log("Dashboard:", dashboardResponse.data);

        setDashboard(dashboardResponse.data);

        const analysisResponse = await api.get(`/analysis/${userId}`);
        console.log("Analysis:", analysisResponse.data);

        setAnalysis(analysisResponse.data);

    } catch (err) {
        console.error(err);
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
            padding: "30px",
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
              title="Monthly Surplus"
              value={`₹${analysis.monthly_surplus || 0}`}
              color="#0891b2"
            />

            <DashboardCard
              title="Outstanding Loan"
              value={`₹${dashboard.total_outstanding || 0}`}
              color="#2563eb"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;