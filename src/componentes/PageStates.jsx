import { Link } from "react-router-dom";

function Loading({ text }) {
  return (
    <div className="state-card">
      <span className="state-icon loading-icon"></span>
      <h2>{text || "Carregando..."}</h2>
      <p>Estamos buscando os dados. Só um instante.</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card">
      <span className="state-icon error-icon"></span>
      <h2>Não foi possível carregar</h2>
      <p>{message}</p>
      {onRetry && <button className="button button-secondary" onClick={onRetry}> Tentar novamente</button>}
    </div>
  );
}

function EmptyState({ filtered, onClear }) {
  return (
    <div className="state-card">
      <span className="state-icon"></span>
      <h2>{filtered ? "Nenhum resultado encontrado" : "Ainda não há itens cadastrados"}</h2>
      <p>{filtered ? "Tente mudar a busca ou os filtros para encontrar o que procura." : "Quando um objeto for registrado, ele aparecerá nesta lista."}</p>
      {filtered ? (
        <button className="button button-secondary" onClick={onClear}> Limpar filtros</button>
      ) : (
        <Link className="button button-primary" to="/novo"> Cadastrar primeiro item</Link>
      )}
    </div>
  );
}

export { Loading, ErrorState, EmptyState };