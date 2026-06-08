import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import {
  carrinhoService,
  pedidosService,
} from "../../services/api";
import "./Checkout.css";

const initialCustomer = {
  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
};

const paymentLabels = {
  pix: "PIX",
  cartao: "Cartao",
  retirada: "Retirada / pagamento na entrega",
};

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [customer, setCustomer] = useState(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState(null);

  const itemsCount = cart.reduce(
    (acc, item) => acc + item.quantidade,
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  }

  function validate() {
    const nextErrors = {};

    Object.entries(customer).forEach(([field, value]) => {
      if (!value.trim()) {
        nextErrors[field] = "Campo obrigatorio";
      }
    });

    if (customer.email && !customer.email.includes("@")) {
      nextErrors.email = "Informe um email valido";
    }

    return nextErrors;
  }

  async function sincronizarCarrinhoBackend() {
    const response =
      await carrinhoService.obterMeuCarrinho();

    const itensAtuais =
      response.data.itens || [];

    await Promise.all(
      itensAtuais.map((item) =>
        carrinhoService.removerMeuItem(item.id)
      )
    );

    for (const item of cart) {
      await carrinhoService.adicionarMeuItem(
        {
          id_produto: item.id,
          quantidade: item.quantidade,
        }
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);

    try {
      await sincronizarCarrinhoBackend();

      const response =
        await pedidosService.finalizarMeu();
      const pedido = response.data;

      const confirmedOrder = {
        code: `TJG-${String(pedido.id).padStart(6, "0")}`,
        customer,
        paymentMethod,
        items: pedido.itens.map((item) => ({
          id: item.id,
          nome: item.nomeProduto,
          quantidade: item.quantidade,
          preco: item.precoUnitario,
        })),
        total: Number(pedido.total),
        createdAt: new Date(pedido.dataPedido).toLocaleString("pt-BR"),
      };

      setOrder(confirmedOrder);
      clearCart();
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel finalizar o pedido. Confira o estoque e tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (order) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-success">
            <span className="checkout-success-label">Pedido confirmado</span>
            <h1>{order.code}</h1>
            <p>
              Sua compra foi concluida com sucesso em {order.createdAt}.
            </p>

            <div className="checkout-success-details">
              <div>
                <strong>Cliente</strong>
                <span>{order.customer.nome}</span>
              </div>

              <div>
                <strong>Pagamento</strong>
                <span>{paymentLabels[order.paymentMethod]}</span>
              </div>

              <div>
                <strong>Total</strong>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-success-items">
              {order.items.map((item) => (
                <div key={item.id}>
                  <span>
                    {item.quantidade}x {item.nome}
                  </span>
                  <strong>
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <Link to="/" className="checkout-primary-btn">
              Voltar para a loja
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <section className="checkout-empty">
            <h1>Seu carrinho esta vazio</h1>
            <p>
              Adicione produtos da torcida antes de iniciar o checkout.
            </p>
            <Link to="/" className="checkout-primary-btn">
              Ver produtos
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-heading">
          <span>Checkout</span>
          <h1>Finalizar compra</h1>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <section className="checkout-panel">
            <h2>Dados do comprador</h2>

            <div className="checkout-form-grid">
              <label>
                Nome completo
                <input
                  name="nome"
                  value={customer.nome}
                  onChange={handleChange}
                  className={errors.nome ? "input-error" : ""}
                />
                {errors.nome && <small>{errors.nome}</small>}
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <small>{errors.email}</small>}
              </label>

              <label>
                Telefone
                <input
                  name="telefone"
                  value={customer.telefone}
                  onChange={handleChange}
                  className={errors.telefone ? "input-error" : ""}
                />
                {errors.telefone && <small>{errors.telefone}</small>}
              </label>

              <label>
                CEP
                <input
                  name="cep"
                  value={customer.cep}
                  onChange={handleChange}
                  className={errors.cep ? "input-error" : ""}
                />
                {errors.cep && <small>{errors.cep}</small>}
              </label>

              <label className="checkout-field-wide">
                Endereco
                <input
                  name="endereco"
                  value={customer.endereco}
                  onChange={handleChange}
                  className={errors.endereco ? "input-error" : ""}
                />
                {errors.endereco && <small>{errors.endereco}</small>}
              </label>

              <label>
                Cidade
                <input
                  name="cidade"
                  value={customer.cidade}
                  onChange={handleChange}
                  className={errors.cidade ? "input-error" : ""}
                />
                {errors.cidade && <small>{errors.cidade}</small>}
              </label>

              <label>
                Estado
                <input
                  name="estado"
                  maxLength="2"
                  value={customer.estado}
                  onChange={handleChange}
                  className={errors.estado ? "input-error" : ""}
                />
                {errors.estado && <small>{errors.estado}</small>}
              </label>
            </div>

            <h2>Pagamento</h2>

            <div className="payment-options">
              {Object.entries(paymentLabels).map(([value, label]) => (
                <label
                  key={value}
                  className={
                    paymentMethod === value
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <aside className="checkout-summary">
            <h2>Resumo do pedido</h2>

            <div className="checkout-summary-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <div>
                    <strong>{item.nome}</strong>
                    <span>
                      {item.quantidade} unidade
                      {item.quantidade > 1 ? "s" : ""}
                    </span>
                  </div>

                  <span>
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-total">
              <span>{itemsCount} item{itemsCount > 1 ? "s" : ""}</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <button
              type="submit"
              className="checkout-primary-btn"
              disabled={isProcessing}
            >
              {isProcessing ? "Processando pedido..." : "Confirmar pedido"}
            </button>
          </aside>
        </form>
      </main>

      <Footer />
    </>
  );
}
