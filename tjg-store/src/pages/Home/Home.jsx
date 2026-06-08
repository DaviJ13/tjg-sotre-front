import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { produtosService } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import "./Home.css";

const CATEGORIAS = [
  "Todos",
  "Camisas",
  "Regatas",
  "Bonés",
  "Calças",
  "Bandeiras",
  "Adesivos",
];

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const { addToCart } = useCart();

  const sectionRefs = useRef({});

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

  function handleCategoriaClick(cat) {
    setCategoria(cat);

    const target = cat === "Todos"
      ? sectionRefs.current["Todos"]
      : sectionRefs.current[cat];

    if (target) {
      const offset = 120; // altura do navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const produtosFiltradosBusca = produtos.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const categoriasSemTodos = CATEGORIAS.filter((c) => c !== "Todos");
  const grupos = categoriasSemTodos
    .map((cat) => ({
      cat,
      items: produtosFiltradosBusca.filter((p) => p.categoria === cat),
    }))
    .filter((g) => g.items.length > 0);

  const gruposVisiveis =
    categoria === "Todos"
      ? grupos
      : grupos.filter((g) => g.cat === categoria);

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

      <main className="home" id="top">
        <div className="store-layout">
          <aside className="sidebar">
            <CategoryFilter
              categoria={categoria}
              setCategoria={handleCategoriaClick}
            />
          </aside>

          <section className="store-content">
            <SearchBar value={busca} onChange={setBusca} />

            {loading ? (
              <h2>Carregando...</h2>
            ) : (
              <div
                className="category-sections"
                ref={(el) => (sectionRefs.current["Todos"] = el)}
              >
                {gruposVisiveis.length === 0 ? (
                  <p className="empty-msg">Nenhum produto encontrado.</p>
                ) : (
                  gruposVisiveis.map(({ cat, items }) => (
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