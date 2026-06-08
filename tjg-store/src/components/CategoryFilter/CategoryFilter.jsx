import "./CategoryFilter.css";

const categorias = [
  "Todos",
  "Camisas",
  "Regatas",
  "Bonés",
  "Calças",
  "Bandeiras",
  "Adesivos",
];

export default function CategoryFilter({
  categoria,
  setCategoria,
}) {
  return (
    <div className="category-box">

      <div className="category-header">
        <h3>Categorias</h3>
      </div>

      <div className="category-list">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={
              categoria === cat
                ? "active"
                : ""
            }
            onClick={() =>
              setCategoria(cat)
            }
          >
            {cat}
          </button>
        ))}
      </div>

    </div>
  );
}