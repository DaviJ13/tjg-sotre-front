import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import patch from "../../assets/patch.png";
import "./Navbar.css";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? " shrink" : ""}`}>
      <div className="navbar-top">

        {/* Esquerda: TJG */}
        <div className="navbar-brand">TJG</div>

        {/* Centro: patch E links — ambos sempre no DOM, CSS anima */}
        <div className="navbar-center">
          <div className="navbar-patch">
            <img src={patch} alt="TJG" />
          </div>

          <nav className="navbar-links-inline">
            <Link to="/">Início</Link>
            <a href="https://trezefc.com.br" target="_blank" rel="noreferrer">
              Treze FC
            </a>
            {isAdmin && <Link to="/admin">Painel</Link>}
          </nav>
        </div>

        {/* Direita: ícones */}
        <div className="navbar-actions">
          <Link to="/carrinho" className="icon-btn">
            <FaShoppingCart />
          </Link>

          <div className="user-menu">
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <FaUser />
            </button>

            {menuOpen && (
              <div className="dropdown">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
                    <Link to="/cadastro" onClick={() => setMenuOpen(false)}>Criar Conta</Link>
                  </>
                ) : (
                  <button onClick={logout}>
                    <FaSignOutAlt />
                    Sair
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Links embaixo — sempre no DOM, CSS anima altura e opacidade */}
      <nav className="navbar-menu">
        <Link to="/">Início</Link>
        <a href="https://trezefc.com.br" target="_blank" rel="noreferrer">
          Treze FC
        </a>
        {isAdmin && <Link to="/admin">Painel</Link>}
      </nav>
    </header>
  );
}
