import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { produtosService } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import "./Home.css";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const { addToCart } = useCart();

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setLoading(true);

      const response =
        await produtosService.listar();

      setProdutos(response.data);
    } catch (error) {
      setErro(
        "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  }

  function adicionarAoCarrinho(
    produto
  ) {
    addToCart(produto);
  }

  const produtosFiltrados =
    produtos.filter((produto) => {
        const matchNome =
        produto.nome
            ?.toLowerCase()
            .includes(
            busca.toLowerCase()
            );

        const matchCategoria =
        categoria === "Todos"
            ? true
            : produto.categoria ===
            categoria;

        return (
        matchNome &&
        matchCategoria
        );
    });

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

      <main className="home">
        <section className="banner">
          <h1>
            Loja Oficial da Torcida Jovem
            do Galo
          </h1>

          <p>
            Vista as cores da maior
            torcida organizada do Treze.
          </p>
        </section>

        <SearchBar
            value={busca}
            onChange={setBusca}
            />

            <CategoryFilter
            categoria={categoria}
            setCategoria={setCategoria}
            />

        {loading ? (
          <h2>Carregando...</h2>
        ) : (
          <div className="products-grid">
            {produtosFiltrados.map(
              (produto) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  onAddToCart={
                    adicionarAoCarrinho
                  }
                />
              )
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}