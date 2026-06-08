import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { usuariosService } from "../../services/api";
import "./Perfil.css";

function formatDate(value) {
  if (!value) {
    return "Nao informado";
  }

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function roleLabel(role) {
  if (role === "ADMIN") {
    return "Administrador";
  }

  return "Cliente";
}

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      setLoading(true);
      setErro("");

      const response = await usuariosService.me();
      setPerfil(response.data);
    } catch (error) {
      console.error(error);
      setErro("Nao foi possivel carregar seu perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-heading">
          <span>Minha conta</span>
          <h1>Meu perfil</h1>
        </div>

        {loading && <p className="profile-state">Carregando perfil...</p>}

        {!loading && erro && (
          <section className="profile-empty">
            <h2>{erro}</h2>
            <button type="button" onClick={carregarPerfil}>
              Tentar novamente
            </button>
          </section>
        )}

        {!loading && !erro && perfil && (
          <section className="profile-card">
            <div className="profile-avatar" aria-hidden="true">
              {perfil.nome?.charAt(0)?.toUpperCase() || "T"}
            </div>

            <div className="profile-main">
              <span>{roleLabel(perfil.role)}</span>
              <h2>{perfil.nome}</h2>
              <p>{perfil.email}</p>
            </div>

            <div className="profile-details">
              <div>
                <span>ID do usuario</span>
                <strong>{perfil.id}</strong>
              </div>

              <div>
                <span>Tipo de conta</span>
                <strong>{roleLabel(perfil.role)}</strong>
              </div>

              <div>
                <span>Cadastro</span>
                <strong>{formatDate(perfil.dataCadastro)}</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
