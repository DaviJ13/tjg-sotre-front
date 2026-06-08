import { useState } from "react";
import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/api";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const from =
    location.state?.from?.pathname ||
    "/";

    async function handleSubmit(e) {
    e.preventDefault();

    try {
        const response =
        await authService.login({
            email,
            senha,
        });

        login(response.data);

        navigate(from, {
        replace: true,
        });
    } catch {
        alert(
        "Email ou senha inválidos"
        );
    }
    }

  return (
    <>
      <Navbar />

      <main className="login-page">
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <h1>Entrar</h1>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            required
          />

          <button type="submit">
            Entrar
          </button>

          <Link to="/cadastro">
            Criar conta
          </Link>
        </form>
      </main>

      <Footer />
    </>
  );
}