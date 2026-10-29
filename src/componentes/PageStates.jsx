// Reutilizamos o mesmo componente para carregamento, erro e lista vazia.
function PageStates({ titulo, mensagem, tipo = "normal", children }) {
  return (
    <div className="state-card" role={tipo === "erro" ? "alert" : undefined}>
      <h3>{titulo}</h3>
      <p>{mensagem}</p>
      {children}
    </div>
  );
}

export default PageStates;