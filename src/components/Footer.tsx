import dayjs from "dayjs";

export function Footer() {
  const currentYear = dayjs().year();
  return (
    <footer className="footer">
      <p>© {currentYear} División de Gastos</p>
      <p className="footer-tagline">
        Diseñado para grupos, viajes y cuentas claras.
      </p>
    </footer>
  );
}
