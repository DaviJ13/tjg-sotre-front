import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import {
  produtosService,
} from "../../services/api";

import { useCart } from "../../contexts/CartContext";
import { getProductImage, handleImageFallback } from "../../utils/productImage";

import "./Produto.css";

export default function Produto() {
  const navigate =
    useNavigate();

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
    addToCart(
      produto
    );

    navigate("/carrinho");
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
            src={getProductImage(produto)}
            alt={produto.nome}
            referrerPolicy="no-referrer"
            onError={handleImageFallback}
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
