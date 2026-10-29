function ItemCard({ nome, categoria, local }) {
  return (
    <div className="card">
      <h2>{nome}</h2>

      <p>Categoria: {categoria}</p>

      <p>Local: {local}</p>
    </div>
  );
}

export default ItemCard;