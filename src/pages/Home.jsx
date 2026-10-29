import { Link } from "react-router-dom";
import ListagemItens from "../componentes/ListagemItens";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">SISTEMA DE ACHADOS E PERDIDOS</span>
          <h1>Perdeu alguma coisa? <span>Vamos encontrar.</span></h1>
          <p>Veja os objetos encontrados no campus e registre novos itens para ajudar outras pessoas.</p>
          <Link to="/novo" className="button button-light">+ Cadastrar item</Link>
        </div>
      </section>
      <ListagemItens />
    </main>
  );
}

export default Home;