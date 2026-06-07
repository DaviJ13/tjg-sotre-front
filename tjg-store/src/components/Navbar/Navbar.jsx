import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } =
    useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
        >
          TJG STORE
        </Link>

        <nav className="navbar-menu">
          <Link to="/">
            Início
          </Link>

          <Link to="/carrinho">
            Carrinho
          </Link>

          {user ? (
            <>
              <Link to="/admin">
                Admin
              </Link>

              <button
                className="logout-btn"
                onClick={logout}
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}