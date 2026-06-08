import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import {
  produtosService,
} from "../../services/api";

import { useCart } from "../../contexts/CartContext";

import "./Produto.css";

export default function Produto() {
  const { id } =
    useParams();

  const { addToCart } =
    useCart();

  const [produto, setProduto] =
    useState(null);

  useEffect(() => {
    carregarProduto();
  }, [id]);

  async function carregarProduto() {
    try {
      const response =
        await produtosService.buscarPorId(
          id
        );

      setProduto(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  }

  function comprarAgora() {
    alert(
      `Compra simulada de ${produto.nome} realizada com sucesso!`
    );
  }

  if (!produto) {
    return (
      <>
        <Navbar />
        <h2>Carregando...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="produto-page">
        <div className="produto-image">
          <img
            src={
              produto.imagemUrl ||
              "https://placehold.co/600x600"
            }
            alt={produto.nome}
          />
        </div>

        <div className="produto-info">
          <span className="produto-categoria">
            {produto.categoria}
          </span>

          <h1>
            {produto.nome}
          </h1>

          <h2>
            R$
            {Number(
              produto.preco
            ).toFixed(2)}
          </h2>

          <p className="produto-descricao">
            {
              produto.descricao
            }
          </p>

          <p>
            Estoque:
            {" "}
            {produto.estoque}
          </p>

          <div className="produto-actions">
            <button
              className="cart-btn"
              onClick={() =>
                addToCart(
                  produto
                )
              }
            >
              Adicionar ao Carrinho
            </button>

            <button
              className="buy-btn"
              onClick={
                comprarAgora
              }
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}