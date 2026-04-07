import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Footer } from "./components/Footer";
import "./style.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró el elemento root");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <main>
      <App />
    </main>
    <Footer />
  </StrictMode>,
);
