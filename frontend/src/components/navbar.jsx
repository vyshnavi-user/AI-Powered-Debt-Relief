import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "#2563EB",
        padding: "15px 25px",
      }}
    >
      <div className="container-fluid">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer" }}
        >
          AI Powered Debt Relief
        </span>

        <div className="ms-auto">
          <button
            className="btn btn-light"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;