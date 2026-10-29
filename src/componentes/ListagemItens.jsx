import { useEffect, useState } from "react";
import api from "../services/api";
import ItemCard from "./ItemCard";
import PageStates from "./PageStates";
import { extrairLista, mostrarErro, valorOpcao } from "../services/format";

function ListagemItens() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const respostaCategorias = await api.get("/categorias");
        const respostaLocais = await api.get("/locais");
        setCategorias(extrairLista(respostaCategorias.data, "categorias"));
        setLocais(extrairLista(respostaLocais.data, "locais"));
      } catch (error) {
        // A listagem continua funcionando mesmo se os filtros não carregarem.
        console.error("Não foi possível carregar as opções dos filtros.", error);
      }
    }

    carregarOpcoes();
    buscarItens();
  }, []);

  async function buscarItens(filtros = {}) {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await api.get("/itens", { params: filtros });
      const lista = extrairLista(resposta.data, "itens");
      setItens(lista);
    } catch (error) {
      setErro(mostrarErro(error));
    } finally {
      setCarregando(false);
    }
  }

  function pesquisar(evento) {
    evento.preventDefault();

    // Só enviamos os filtros que estão preenchidos.
    const filtros = {};
    if (busca.trim()) filtros.busca = busca.trim();
    if (status) filtros.status = status;
    if (categoria) filtros.categoria = categoria;
    if (local) filtros.local = local;

    buscarItens(filtros);
  }

  function limparFiltros() {
    setBusca("");
    setStatus("");
    setCategoria("");
    setLocal("");
    buscarItens();
  }

  return (
    <section className="listing-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow eyebrow-dark">OBJETOS DO CAMPUS</span>
          <h2>Itens encontrados</h2>
          <p>Pesquise para descobrir se alguém encontrou o que você perdeu.</p>
        </div>
      </div>

      <form className="filter-panel" onSubmit={pesquisar}>
        <label className="search-box">
          Buscar por nome ou descrição
          <input value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Ex.: garrafa azul" />
        </label>
        <div className="filter-row">
          <span className="filter-label">Filtrar:</span>
          <select aria-label="Status" value={status} onChange={(evento) => setStatus(evento.target.value)}>
            <option value="">Todos os status</option>
            <option value="aguardando">Aguardando</option>
            <option value="devolvido">Devolvido</option>
          </select>
          <select aria-label="Categoria" value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
            <option value="">Todas as categorias</option>
            {categorias.map((opcao) => {
              const valor = valorOpcao(opcao);
              return <option key={valor} value={valor}>{valor}</option>;
            })}
          </select>
          <select aria-label="Local" value={local} onChange={(evento) => setLocal(evento.target.value)}>
            <option value="">Todos os locais</option>
            {locais.map((opcao) => {
              const valor = valorOpcao(opcao);
              return <option key={valor} value={valor}>{valor}</option>;
            })}
          </select>
          <button type="submit" className="button button-primary">Buscar</button>
          <button type="button" className="clear-filters" onClick={limparFiltros}>Limpar</button>
        </div>
      </form>

      {carregando ? (
        <PageStates titulo="Carregando" mensagem="Buscando itens na API..." />
      ) : erro ? (
        <PageStates titulo="Erro ao carregar" mensagem={erro} tipo="erro">
          <button className="button button-secondary" onClick={() => buscarItens()}>Tentar novamente</button>
        </PageStates>
      ) : itens.length === 0 ? (
        <PageStates titulo="Nenhum item encontrado" mensagem="Tente outros filtros ou cadastre um novo item." />
      ) : (
        <>
          <p className="results-line"><strong>{itens.length}</strong> item(ns) encontrado(s)</p>
          <div className="items-grid">
            {itens.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </>
      )}
    </section>
  );
}

export default ListagemItens;