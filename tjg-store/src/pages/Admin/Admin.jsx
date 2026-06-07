import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { produtosService } from "../../services/api";
import "./Admin.css";

export default function Admin() {
  const [produtos, setProdutos] =
    useState([]);

  const [editando, setEditando] =
    useState(null);

  const [form, setForm] =
    useState({
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
      const response =
        await produtosService.listar();

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
        await produtosService.atualizar(
          editando,
          payload
        );
      } else {
        await produtosService.criar(
          payload
        );
      }

      limparFormulario();

      carregarProdutos();
    } catch (error) {
      console.error(error);
      alert(
        "Erro ao salvar produto"
      );
    }
  }

  async function excluir(id) {
    if (
      !window.confirm(
        "Deseja excluir este produto?"
      )
    ) {
      return;
    }

    try {
      await produtosService.remover(
        id
      );

      carregarProdutos();
    } catch (error) {
      console.error(error);
    }
  }

  function editar(produto) {
    setEditando(produto.id);

    setForm({
      nome: produto.nome,
      descricao:
        produto.descricao,
      preco: produto.preco,
      imagemUrl:
        produto.imagemUrl ||
        "",
      categoria:
        produto.categoria ||
        "Camisas",
      estoque:
        produto.estoque || 0,
      ativo:
        produto.ativo ??
        true,
    });
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

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <h1>
          Painel Administrativo
        </h1>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) =>
              setForm({
                ...form,
                nome:
                  e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) =>
              setForm({
                ...form,
                descricao:
                  e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={form.preco}
            onChange={(e) =>
              setForm({
                ...form,
                preco:
                  e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="URL da imagem"
            value={form.imagemUrl}
            onChange={(e) =>
              setForm({
                ...form,
                imagemUrl:
                  e.target.value,
              })
            }
          />

          <select
            value={form.categoria}
            onChange={(e) =>
              setForm({
                ...form,
                categoria:
                  e.target.value,
              })
            }
          >
            <option>
              Camisas
            </option>
            <option>
              Regatas
            </option>
            <option>Bonés</option>
            <option>
              Bandeiras
            </option>
            <option>
              Adesivos
            </option>
            <option>
              Instrumentos
            </option>
          </select>

          <input
            type="number"
            placeholder="Estoque"
            value={form.estoque}
            onChange={(e) =>
              setForm({
                ...form,
                estoque:
                  e.target.value,
              })
            }
            required
          />

          <label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) =>
                setForm({
                  ...form,
                  ativo:
                    e.target.checked,
                })
              }
            />

            Produto ativo
          </label>

          <div className="admin-buttons">
            <button
              type="submit"
            >
              {editando
                ? "Atualizar Produto"
                : "Cadastrar Produto"}
            </button>

            <button
              type="button"
              onClick={
                limparFormulario
              }
            >
              Limpar
            </button>
          </div>
        </form>

        <div className="admin-grid">
          {produtos.map(
            (produto) => (
              <div
                key={produto.id}
                className="admin-card"
              >
                <img
                  src={
                    produto.imagemUrl ||
                    "https://placehold.co/400x400"
                  }
                  alt={
                    produto.nome
                  }
                />

                <h3>
                  {produto.nome}
                </h3>

                <p>
                  {
                    produto.categoria
                  }
                </p>

                <span>
                  R$ {produto.preco}
                </span>

                <div className="admin-card-actions">
                  <button
                    onClick={() =>
                      editar(
                        produto
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      excluir(
                        produto.id
                      )
                    }
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}