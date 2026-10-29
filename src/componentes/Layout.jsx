import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import api from "../services/api";
import { mostrarErro } from "../services/format";

// O cabeçalho aparece em todas as páginas.
function Layout({ children }) {
  const [aluno, setAluno] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function buscarAluno() {
      try {
        const resposta = await api.get("/eu");
        if (ativo) setAluno(resposta.data);
      } catch (error) {
        if (ativo) setErro(mostrarErro(error));
      }
    }

    buscarAluno();
    return () => { ativo = false; };
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span aria-hidden="true">📦</span>
            <span>
              <strong>Inventum</strong>
              <small>Achados e perdidos • IFRN</small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Menu principal">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Itens
            </NavLink>
            <NavLink to="/novo" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Novo item
            </NavLink>
          </nav>

          <div className="owner-chip">
            <span className="owner-dot" aria-hidden="true" />
            <span>
              <small>Identificação</small>
              <strong>{erro ? "Erro ao carregar aluno" : aluno ? `Olá, ${aluno.nome}!` : "Carregando..."}</strong>
            </span>
          </div>
        </div>
      </header>

      {erro && <div className="notice error" role="alert">{erro}</div>}
      <div className="page-content">{children}</div>
      <footer className="footer">
        <span>Inventum • IFRN Pau dos Ferros</span>
        <span className="footer-muted">Projeto de Programação para Internet</span>
      </footer>
    </div>
  );
}

export default Layout;