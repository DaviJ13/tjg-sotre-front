import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="search-input"
      />
    </div>
  );
}