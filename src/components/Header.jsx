export default function Header({ total, remaining, theme, onToggleTheme, onToggleCalendar }) {
  return (
    <header className="header header--full" role="banner">
      <div className="header__inner">
        <div className="header__content">
          <h1 className="header__title">My Tasks</h1>
          <span className="header__meta">{remaining} of {total} remaining</span>
        </div>

        <div className="header__actions">
          <button className="theme-toggle" type="button" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button className="theme-toggle calendar-toggle" type="button" onClick={onToggleCalendar} aria-label="Open calendar">
            📅 Calendar
          </button>
        </div>
      </div>
    </header>
  );
}
