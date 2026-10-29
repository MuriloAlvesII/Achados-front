import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import PageStates from "../componentes/PageStates";
import { formatarData, mostrarErro } from "../services/format";

function Detailhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [devolvidoPara, setDevolvidoPara] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarItem() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await api.get(`/itens/${id}`);
        if (ativo) setItem(resposta.data);
      } catch (error) {
        if (ativo) {
          setErro(error.response?.status === 404 ? "Item não encontrado." : mostrarErro(error));
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarItem();
    return () => { ativo = false; };
  }, [id]);

  async function marcarDevolvido(evento) {
    evento.preventDefault();
    if (!devolvidoPara.trim()) return;

    setSalvando(true);
    setErroAcao("");
    setSucesso("");

    try {
      await api.patch(`/itens/${id}/devolver`, {
        devolvido_para: devolvidoPara.trim(),
      });

      // Buscamos novamente para mostrar o status e a data atualizados.
      const resposta = await api.get(`/itens/${id}`);
      setItem(resposta.data);
      setSucesso("Devolução registrada com sucesso!");
      setDevolvidoPara("");
    } catch (error) {
      setErroAcao(mostrarErro(error));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirItem() {
    // O professor pediu uma confirmação antes de excluir.
    const confirmou = window.confirm(`Tem certeza que deseja excluir "${item.nome}"?`);
    if (!confirmou) return;

    setSalvando(true);
    setErroAcao("");

    try {
      await api.delete(`/itens/${id}`);
      navigate("/");
    } catch (error) {
      setErroAcao(mostrarErro(error));
      setSalvando(false);
    }
  }

  if (carregando) {
    return <PageStates titulo="Carregando" mensagem="Buscando os detalhes do item..." />;
  }

  if (erro || !item) {
    return (
      <PageStates titulo="Não foi possível abrir o item" mensagem={erro || "Item não encontrado."} tipo="erro">
        <Link to="/" className="button button-secondary">Voltar para a lista</Link>
      </PageStates>
    );
  }

  const devolvido = item.status === "devolvido";

  return (
    <main className="narrow-page">
      <Link to="/" className="back-link">← Voltar para a lista</Link>

      <article className="detail-card">
        <div className="detail-cover">
          <span className="eyebrow eyebrow-dark">DETALHES DO OBJETO</span>
          <h1>{item.nome}</h1>
          <p>Informações registradas no sistema</p>
          <span className={devolvido ? "status-badge status-returned" : "status-badge status-waiting"}>
            {devolvido ? "Devolvido" : "Aguardando"}
          </span>
        </div>

        <div className="detail-content">
          <div className="detail-description">
            <strong>Descrição</strong>
            <p>{item.descricao || "Sem descrição."}</p>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info"><span className="detail-label">Categoria</span><strong>{item.categoria}</strong></div>
            <div className="detail-info"><span className="detail-label">Local</span><strong>{item.local}</strong></div>
            <div className="detail-info"><span className="detail-label">Encontrado em</span><strong>{formatarData(item.data_encontrado)}</strong></div>
            <div className="detail-info"><span className="detail-label">Situação</span><strong>{devolvido ? "Devolvido" : "Aguardando devolução"}</strong></div>

            {devolvido && (
              <>
                <div className="detail-info"><span className="detail-label">Devolvido para</span><strong>{item.devolvido_para || "Não informado"}</strong></div>
                <div className="detail-info"><span className="detail-label">Data da devolução</span><strong>{formatarData(item.data_devolucao)}</strong></div>
              </>
            )}
          </div>

          {erroAcao && <div className="notice error" role="alert">{erroAcao}</div>}
          {sucesso && <div className="notice success" role="status">{sucesso}</div>}

          {!devolvido && (
            <form className="return-form" onSubmit={marcarDevolvido}>
              <h2>Marcar como devolvido</h2>
              <label className="field">
                Nome de quem recebeu o objeto
                <input value={devolvidoPara} onChange={(evento) => setDevolvidoPara(evento.target.value)} required placeholder="Nome da pessoa" />
              </label>
              <div className="return-actions">
                <button className="button button-primary" type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : "Confirmar devolução"}
                </button>
              </div>
            </form>
          )}

          <div className="detail-actions">
            <Link to={`/editar/${id}`} className="button button-secondary">Editar</Link>
            <button type="button" className="button button-danger-outline" disabled={salvando} onClick={excluirItem}>Excluir</button>
          </div>
        </div>
      </article>
    </main>
  );
}

export default Detailhe;