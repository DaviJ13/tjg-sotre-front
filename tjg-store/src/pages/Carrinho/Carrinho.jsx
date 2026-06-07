import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../contexts/CartContext";
import "./Carrinho.css";

export default function Carrinho() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const total = cart.reduce(
    (acc, item) =>
      acc +
      item.preco *
        item.quantidade,
    0
  );

  function finalizarCompra() {
    alert(
      "Compra simulada realizada com sucesso!"
    );
  }

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <h1>Meu Carrinho</h1>

        {cart.length === 0 ? (
          <p>
            Nenhum produto no
            carrinho.
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="cart-item"
              >
                <img
                  src={
                    item.imagemUrl ||
                    "https://placehold.co/150"
                  }
                  alt={item.nome}
                />

                <div>
                  <h3>
                    {item.nome}
                  </h3>

                  <p>
                    R${" "}
                    {Number(
                      item.preco
                    ).toFixed(2)}
                  </p>
                </div>

                <input
                  type="number"
                  min="1"
                  value={
                    item.quantidade
                  }
                  onChange={(e) =>
                    updateQuantity(
                      item.id,
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                />

                <button
                  onClick={() =>
                    removeFromCart(
                      item.id
                    )
                  }
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="cart-total">
              <h2>
                Total: R${" "}
                {total.toFixed(2)}
              </h2>

              <button
                onClick={
                  finalizarCompra
                }
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}