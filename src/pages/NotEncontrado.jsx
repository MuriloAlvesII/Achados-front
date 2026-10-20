import { Link } from "react-router-dom";

function NotEncontrado() {
  return (
    <div className="state-card not-found">
      <span className="state-icon"></span>
      <h2>Essa página não foi encontrada</h2>
      <p>O endereço pode estar incorreto ou o conteúdo não existe.</p>
      <Link to="/" className="button button-primary">Voltar ao início</Link>
    </div>
  );
}

export default NotEncontrado;