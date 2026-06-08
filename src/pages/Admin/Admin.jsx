import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { produtosService } from "../../services/api";
import { getProductImage, handleImageFallback } from "../../utils/productImage";
import "./Admin.css";

export default function Admin() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    imagemUrl: "",
    categoria: "Camisas",
    estoque: 0,
    ativo: true,
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const response = await produtosService.listar();
      setProdutos(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        preco: Number(form.preco),
        estoque: Number(form.estoque),
      };
      if (editando) {
        await produtosService.atualizar(editando, payload);
      } else {
        await produtosService.criar(payload);
      }
      limparFormulario();
      carregarProdutos();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar produto");
    }
  }

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este produto?")) return;
    try {
      await produtosService.remover(id);
      carregarProdutos();
    } catch (error) {
      console.error(error);
    }
  }

  function editar(produto) {
    setEditando(produto.id);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagemUrl: produto.imagemUrl || "",
      categoria: produto.categoria || "Camisas",
      estoque: produto.estoque || 0,
      ativo: produto.ativo ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function limparFormulario() {
    setEditando(null);
    setForm({
      nome: "",
      descricao: "",
      preco: "",
      imagemUrl: "",
      categoria: "Camisas",
      estoque: 0,
      ativo: true,
    });
  }

  function campo(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <h1>Painel Administrativo</h1>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => campo("nome", e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={form.preco}
            onChange={(e) => campo("preco", e.target.value)}
            required
          />

          <textarea
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => campo("descricao", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="URL da imagem"
            value={form.imagemUrl}
            onChange={(e) => campo("imagemUrl", e.target.value)}
          />

          <select
            value={form.categoria}
            onChange={(e) => campo("categoria", e.target.value)}
          >
            <option>Camisas</option>
            <option>Short</option>
            <option>Bonés</option>
            <option>Calças</option>
            <option>Bandeiras</option>
            <option>Adesivos</option>
            <option>Acessórios</option>
          </select>

          <input
            type="number"
            placeholder="Estoque"
            value={form.estoque}
            onChange={(e) => campo("estoque", e.target.value)}
            required
          />

          <label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => campo("ativo", e.target.checked)}
            />
            Produto ativo
          </label>

          <div className="admin-buttons">
            <button type="submit">
              {editando ? "Atualizar Produto" : "Cadastrar Produto"}
            </button>
            <button type="button" onClick={limparFormulario}>
              Limpar
            </button>
          </div>
        </form>

        <p className="admin-section-title">Produtos cadastrados</p>

        <div className="admin-grid">
          {produtos.map((produto) => {
            return (
              <div key={produto.id} className="admin-card">
                <img
                  className="admin-card-image"
                  src={getProductImage(produto)}
                  alt={produto.nome}
                  referrerPolicy="no-referrer"
                  onError={handleImageFallback}
                />

                <div className="admin-card-body">
                  <h3>{produto.nome}</h3>
                  <span className="admin-card-cat">{produto.categoria}</span>
                  <span className="admin-card-price">
                    R$ {Number(produto.preco).toFixed(2)}
                  </span>
                  <span className="admin-card-stock">
                    Estoque: {produto.estoque ?? 0}
                  </span>
                </div>

                <div className="admin-card-actions">
                  <button onClick={() => editar(produto)}>Editar</button>
                  <button onClick={() => excluir(produto.id)}>Excluir</button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}
