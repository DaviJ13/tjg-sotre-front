import "./ProductCard.css";
import { Link } from "react-router-dom";

export default function ProductCard({
  produto,
  onAddToCart,
}) {
  function comprarAgora() {
    alert(
      `Compra simulada do produto "${produto.nome}" realizada com sucesso!`
    );
  }

  return (
    <div className="product-card">
      <Link
        to={`/produto/${produto.id}`}
        className="product-link"
      >
        <img
          src={
            produto.imagemUrl &&
            produto.imagemUrl.trim() !== ""
                ? produto.imagemUrl
                : "https://placehold.co/400x400?text=TJG"
            }
          alt={produto.nome}
        />

        <div className="product-info">
          <h3>{produto.nome}</h3>

          <p>{produto.descricao}</p>

          <span>
            R${" "}
            {Number(
              produto.preco
            ).toFixed(2)}
          </span>
        </div>
      </Link>

      <div className="product-actions">
        <button
          className="cart-btn"
          onClick={() =>
            onAddToCart(produto)
          }
        >
          Adicionar ao Carrinho
        </button>

        <button
          className="buy-btn"
          onClick={comprarAgora}
        >
          Comprar Agora
        </button>
      </div>
    </div>
  );
}