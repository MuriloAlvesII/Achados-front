import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import { formatDate, getItemId } from "../services/format.js";

function ItemCard({ item }) {
  const id = getItemId(item);
  return (
    <Link className="item-card" to={`/item/${id}`}>
      <div className="item-card-top">
        <StatusBadge status={item.status} />
      </div>

      <div className="item-card-body">
        <h3>{item.nome || "Item sem nome"}</h3>
        <p className="item-description">{item.descricao || "Sem descrição informada."}</p>
      </div>

      <div className="item-meta">
        <span>{item.categoria || "Sem categoria"}</span>
        <span>{item.local || "Local não informado"}</span>
        <span>{formatDate(item.data_encontrado)}</span>
      </div>
      
      <div className="item-card-link">Ver detalhes </div>
    </Link>
  );
}

export default ItemCard;