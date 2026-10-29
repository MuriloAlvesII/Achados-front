import { Link } from "react-router-dom";
import { formatarData } from "../services/format";

// Um card recebe um item e mostra suas informações.
function ItemCard({ item }) {
  const devolvido = item.status === "devolvido";

  return (
    <article className="item-card">
      <div className="item-card-top">
        <span className={devolvido ? "status-badge status-returned" : "status-badge status-waiting"}>
          {devolvido ? "Devolvido" : "Aguardando"}
        </span>
      </div>
      <div className="item-card-body">
        <h3>{item.nome}</h3>
        <p className="item-description">{item.descricao || "Sem descrição."}</p>
        <div className="item-meta">
          <span>{item.categoria}</span>
          <span>{item.local}</span>
          <span>{formatarData(item.data_encontrado)}</span>
        </div>
      </div>
      <Link to={`/item/${item.id}`} className="item-card-link">Ver detalhes →</Link>
    </article>
  );
}

export default ItemCard;