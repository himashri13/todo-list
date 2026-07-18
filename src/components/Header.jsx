export default function Header({ total, remaining, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">My Tasks</h1>
        <span className="header__meta">{remaining} of {total} remaining</span>
      </div>

      <button className="theme-toggle" type="button" onClick={onToggleTheme}>
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}
