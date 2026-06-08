import "./ProductCard.css";
import { Link, useNavigate } from "react-router-dom";
import { getProductImage, handleImageFallback } from "../../utils/productImage";

export default function ProductCard({
  produto,
  onAddToCart,
}) {
  const navigate = useNavigate();

  function comprarAgora() {
    onAddToCart();
    navigate("/carrinho");
  }

  return (
    <div className="product-card">
      <Link
        to={`/produto/${produto.id}`}
        className="product-link"
      >
        <img
          src={getProductImage(produto)}
          alt={produto.nome}
          referrerPolicy="no-referrer"
          onError={handleImageFallback}
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
