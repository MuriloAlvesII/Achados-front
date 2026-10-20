import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import api, { getApiError, getCategorias, getLocais } from "../services/api.js";
import { getItemId } from "../services/format.js";

import ItemCard from "../componentes/ItemCard.jsx";
import {Loading, ErrorState, EmptyState} from "../componentes/PageStates.jsx";


function getNomeOption(item) {
  if (typeof item === "string") return item;
  return item.nome || item.categoria || item.local || item.name;
}

function HomePage() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const busca = searchParams.get("busca") || "";
  const status = searchParams.get("status") || "";
  const categoria = searchParams.get("categoria") || "";
  const local = searchParams.get("local") || "";

  async function loadItens() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/itens");
      setItens(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError(getApiError(error));
    }

    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      setCategorias([]);
    }

    try {
      const data = await getLocais();
      setLocais(data);
    } catch (error) {
      setLocais([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadItens();
  }, []);

  const itensFiltrados = itens.filter((item) => {
    const termo = busca.toLowerCase().trim();
    const text = `${item.nome || ""} ${item.descricao || ""}`.toLowerCase();

    if (termo && !text.includes(termo)) return false;
    if (status && item.status !== status) return false;
    if (categoria && item.categoria !== categoria) return false;
    if (local && item.local !== local) return false;
    return true;
  });

  function changeFiltro(name, value) {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(name, value);
    else newParams.delete(name);
    setSearchParams(newParams);
  }

  function limparFiltros() {
    setSearchParams({});
  }

  const aguardando = itens.filter((item) => item.status !== "devolvido").length;
  const devolvidos = itens.filter((item) => item.status === "devolvido").length;
  const temFiltros = busca || status || categoria || local;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>Encontre o que está procurando</h1>
          <h1>ou<br /><span>Saia do site.</span></h1>
          <p>Abaixo.</p>
          <Link to="/novo" className="button button-light"> Registre um item encontrado.</Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-package"></div>
          <span className="float-tag float-tag-one"> Devolução feliz</span>
          <span className="float-tag float-tag-two"> Busca rápida</span>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumo dos itens">
        <div className="stat-card"><span className="stat-icon stat-blue"></span><div><span className="stat-label">Total de itens</span><strong>{itens.length}</strong></div></div>
        <div className="stat-card"><span className="stat-icon stat-amber"></span><div><span className="stat-label">Aguardando dono</span><strong>{aguardando}</strong></div></div>
        <div className="stat-card"><span className="stat-icon stat-green"></span><div><span className="stat-label">Devolvidos</span><strong>{devolvidos}</strong></div></div>
      </section>

      <section className="listing-section">
        <div className="section-heading">
          <div><span className="eyebrow eyebrow-dark">LISTA DE ITENS</span><h2>Itens encontrados</h2></div>
          <Link to="/novo" className="button button-primary"> Novo item</Link>
        </div>

        <div className="filter-panel">
          <label className="search-box"><input aria-label="Buscar por nome ou descrição" value={busca} onChange={(e) => changeFiltro("busca", e.target.value)} placeholder="Buscar por nome ou descrição..." />{busca && <button type="button" aria-label="Limpar busca" className="icon-button" onClick={() => changeFiltro("busca", "")}></button>}</label>
          <div className="filter-row">
            <span className="filter-label"> Filtros</span>
            <select aria-label="Filtrar por status" value={status} onChange={(e) => changeFiltro("status", e.target.value)}><option value="">Todos os status</option><option value="aguardando">Aguardando</option><option value="devolvido">Devolvido</option></select>
            <select aria-label="Filtrar por categoria" value={categoria} onChange={(e) => changeFiltro("categoria", e.target.value)}><option value="">Todas as categorias</option>{categorias.map((item) => <option key={getNomeOption(item)} value={getNomeOption(item)}>{getNomeOption(item)}</option>)}</select>
            <select aria-label="Filtrar por local" value={local} onChange={(e) => changeFiltro("local", e.target.value)}><option value="">Todos os locais</option>{locais.map((item) => <option key={getNomeOption(item)} value={getNomeOption(item)}>{getNomeOption(item)}</option>)}</select>
            {temFiltros && <button className="clear-filters" onClick={limparFiltros}>Limpar</button>}
          </div>
        </div>

        {loading ? <Loading text="Carregando itens..." /> : error ? <ErrorState message={error} onRetry={loadItens} /> : itensFiltrados.length === 0 ? <EmptyState filtered={Boolean(temFiltros)} onClear={limparFiltros} /> : (
          <>
            <div className="results-line"><span><strong>{itensFiltrados.length}</strong> {itensFiltrados.length === 1 ? "item encontrado" : "itens encontrados"}</span><button className="text-button" onClick={loadItens}> Atualizar lista</button></div>
            <div className="items-grid">{itensFiltrados.map((item, index) => <ItemCard key={getItemId(item) || index} item={item} />)}</div>
          </>
        )}
      </section>
    </>
  );
}

export default HomePage;