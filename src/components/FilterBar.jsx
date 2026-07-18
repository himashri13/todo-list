const FILTERS = ['all', 'active', 'completed'];

export default function FilterBar({ current, onChange }) {
  return (
    <nav className="filter-bar" aria-label="Filter tasks">
      {FILTERS.map((f) => (
        <button
          key={f}
          id={`filter-${f}`}
          className={`filter-bar__btn${current === f ? ' filter-bar__btn--active' : ''}`}
          onClick={() => onChange(f)}
          aria-pressed={current === f}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </nav>
  );
}
