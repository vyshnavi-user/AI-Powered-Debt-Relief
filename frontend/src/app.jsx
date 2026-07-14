import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Loan from "./pages/Loan";
import AIAssistant from "./pages/AIAssistant";

// Protect routes after login
function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Loan Management */}

        <Route
          path="/loan"
          element={
            <ProtectedRoute>
              <Loan />
            </ProtectedRoute>
          }
        />

        {/* AI Assistant */}

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;