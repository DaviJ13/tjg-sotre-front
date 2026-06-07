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
    <div className="category-filter">
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
  );
}