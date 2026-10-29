import { Link } from "react-router-dom";
import PageStates from "../componentes/PageStates";

function NotEncontrado() {
  return (
    <PageStates titulo="Página não encontrada" mensagem="Este endereço não existe no sistema.">
      <Link className="button button-primary" to="/">Voltar para a lista</Link>
    </PageStates>
  );
}

export default NotEncontrado;