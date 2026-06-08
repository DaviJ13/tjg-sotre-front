import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { usuariosService } from "../../services/api";
import "./Cadastro.css";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  function campo(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await usuariosService.cadastrar(form);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />

      <main className="cadastro-page">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h1>Criar Conta</h1>

          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => campo("nome", e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => campo("email", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={form.senha}
            onChange={(e) => campo("senha", e.target.value)}
            required
          />

          <button type="submit">Cadastrar</button>

          <span className="cadastro-login-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </span>
        </form>
      </main>

      <Footer />
    </>
  );
}