import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="app-header">
      <div>
        <p className="header-kicker">Split Smart</p>
        <h1>División de Gastos</h1>
        <p className="header-subtitle">
          Registra pagos compartidos y liquida balances en segundos.
        </p>
      </div>
      <div className="header-actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
