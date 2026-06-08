import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { pedidosService } from "../../services/api";
import { getProductImage, handleImageFallback } from "../../utils/productImage";
import "./Pedidos.css";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      setLoading(true);
      setErro("");

      const response = await pedidosService.listarMeus();
      setPedidos(response.data || []);
    } catch (error) {
      console.error(error);
      setErro("Nao foi possivel carregar seus pedidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <div className="orders-heading">
          <span>Minha conta</span>
          <h1>Meus pedidos</h1>
        </div>

        {loading && <p className="orders-state">Carregando pedidos...</p>}

        {!loading && erro && (
          <section className="orders-empty">
            <h2>{erro}</h2>
            <button type="button" onClick={carregarPedidos}>
              Tentar novamente
            </button>
          </section>
        )}

        {!loading && !erro && pedidos.length === 0 && (
          <section className="orders-empty">
            <h2>Voce ainda nao tem pedidos</h2>
            <p>Quando finalizar uma compra, ela aparecera aqui.</p>
            <Link to="/">Ver produtos</Link>
          </section>
        )}

        {!loading && !erro && pedidos.length > 0 && (
          <div className="orders-list">
            {pedidos.map((pedido) => (
              <section key={pedido.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span>Pedido</span>
                    <h2>TJG-{String(pedido.id).padStart(6, "0")}</h2>
                  </div>

                  <div className="order-status">{pedido.status}</div>
                </div>

                <div className="order-meta">
                  <span>{formatDate(pedido.dataPedido)}</span>
                  <strong>{formatCurrency(pedido.total)}</strong>
                </div>

                <div className="order-items">
                  {(pedido.itens || []).map((item) => (
                    <div key={item.id} className="order-item">
                      <img
                        src={getProductImage(item)}
                        alt={item.nomeProduto}
                        referrerPolicy="no-referrer"
                        onError={handleImageFallback}
                      />

                      <div>
                        <h3>{item.nomeProduto}</h3>
                        <span>
                          {item.quantidade} unidade
                          {item.quantidade > 1 ? "s" : ""}
                        </span>
                      </div>

                      <strong>
                        {formatCurrency(
                          Number(item.precoUnitario) * Number(item.quantidade)
                        )}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
