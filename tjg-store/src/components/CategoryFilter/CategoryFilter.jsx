import "./CategoryFilter.css";

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

export default function CategoryFilter({ setCategoria }) {
  return (
    <div className="category-box">
      <div className="category-header">
        <h3>Categorias</h3>
      </div>
      <div className="category-list">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
