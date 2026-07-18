export default function Header({ total, remaining }) {
  return (
    <header className="header">
      <h1 className="header__title">
        My Tasks
      </h1>
      <span className="header__meta">
        {remaining} of {total} remaining
      </span>
    </header>
  );
}
