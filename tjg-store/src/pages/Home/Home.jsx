import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { produtosService } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import "./Home.css";

const categorias = [
  "Todos",
  "Camisas",
  "Short",
  "Bonés",
  "Calças",
  "Bandeiras",
  "Adesivos",
  "Acessórios",
];

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const { addToCart } = useCart();
  const sectionRefs = useRef({});
  const topoRef = useRef(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setLoading(true);
      const response = await produtosService.listar();
      setProdutos(response.data);
    } catch (error) {
      setErro("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  function scrollParaSecao(cat) {
    if (cat === "Todos") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = sectionRefs.current[cat];
    if (el) {
      const offset = 110;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const produtosFiltrados = produtos.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const grupos = categorias.filter(c => c !== "Todos").map((cat) => ({
    cat,
    items: produtosFiltrados.filter((p) => p.categoria === cat),
  })).filter((g) => g.items.length > 0);

  if (erro) {
    return (
      <>
        <Navbar />
        <main className="home">
          <h2>{erro}</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="home" ref={topoRef} id="top">
        <div className="store-layout">
          <aside className="sidebar">
            <CategoryFilter setCategoria={scrollParaSecao} />
          </aside>

          <section className="store-content">
            <SearchBar value={busca} onChange={setBusca} />

            {loading ? (
              <h2>Carregando...</h2>
            ) : (
              <div className="category-sections">
                {grupos.length === 0 ? (
                  <p className="empty-msg">Nenhum produto encontrado.</p>
                ) : (
                  grupos.map(({ cat, items }) => (
                    <div
                      key={cat}
                      className="category-section"
                      ref={(el) => (sectionRefs.current[cat] = el)}
                    >
                      <h2 className="category-title">{cat}</h2>
                      <div className="products-grid">
                        {items.map((produto) => (
                          <ProductCard
                            key={produto.id}
                            produto={produto}
                            onAddToCart={() => addToCart(produto)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
