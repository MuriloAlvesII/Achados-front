import { Link, NavLink, Outlet } from "react-router-dom";

function Layout({ dono }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand" aria-label="Achados e Perdidos - início">
            <span><strong>Inventum<span className="brand-amp"></span></strong><small>IFRN · Campus Pau dos Ferros</small></span>
          </Link>

          <nav className="main-nav" aria-label="Navegação principal">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> Início</NavLink>
            <NavLink to="/novo" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}> Novo item</NavLink>
          </nav>

          <div className="owner-chip"><span className="owner-dot" /><span><small>Conectado como</small><strong>{dono || "Carregando..."}</strong></span></div>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
       
      <footer className="footer">
        <span> Inventum <span className="footer-muted"> </span></span>
        <span className="footer-muted">Sistema de achados e perdidos do IFRN.</span>
      </footer>
    </div>
  );
}

export default Layout;