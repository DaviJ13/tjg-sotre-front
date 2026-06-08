import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { getProductImage, handleImageFallback } from "../../utils/productImage";
import "./Carrinho.css";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <h1>Meu Carrinho</h1>

        {cart.length === 0 ? (
          <p className="cart-empty">Nenhum produto no carrinho.</p>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => {
                return (
                  <div key={item.id} className="cart-item">
                    <img
                      src={getProductImage(item)}
                      alt={item.nome}
                      referrerPolicy="no-referrer"
                      onError={handleImageFallback}
                    />

                    <div className="cart-item-info">
                      <h3>{item.nome}</h3>
                      <p>R$ {Number(item.preco).toFixed(2)}</p>
                    </div>

                    <input
                      className="cart-item-qty"
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    />

                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      Remover
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-total">
              <h2>Total: R$ {total.toFixed(2)}</h2>
              <Link to="/checkout" className="cart-checkout-btn">
                Finalizar Compra
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
