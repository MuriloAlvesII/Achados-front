import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api, { getApiError } from "../services/api.js";
import { formatDate } from "../services/format.js";

import StatusBadge from "../componentes/StatusBadge.jsx";
import { Loading, ErrorState, EmptyState } from "../componentes/PageStates.jsx";

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returnName, setReturnName] = useState("");
  const [showReturn, setShowReturn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  async function loadItem() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/itens/${id}`);
      setItem(response.data);
    } catch (error) {
      setError(getApiError(error));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItem();
  }, [id]);

  async function deleteItem() {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) return;
    setSaving(true);
    try {
      await api.delete(`/itens/${id}`);
      navigate("/");
    } catch (error) {
      setNotice(getApiError(error));
      setNoticeType("error");
    }
    setSaving(false);
  }

  async function returnItem(event) {
    event.preventDefault();
    if (!returnName.trim()) return;
    setSaving(true);
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: returnName.trim() });
      setNotice("Item marcado como devolvido com sucesso.");
      setNoticeType("success");
      setShowReturn(false);
      setReturnName("");
      loadItem();
    } catch (error) {
      setNotice(getApiError(error));
      setNoticeType("error");
    }
    setSaving(false);
  }

  if (loading) return <Loading text="Carregando detalhes..." />;
  if (error) return <><Link to="/" className="back-link"> Voltar para os itens</Link><ErrorState message={error} onRetry={loadItem} /></>;
  if (!item) return <EmptyState filtered={false} />;

  return (
    <div className="narrow-page">
      <Link to="/" className="back-link"> Voltar para os itens</Link>
      {notice && <div className={`notice ${noticeType}`}>{notice}<button className="icon-button" onClick={() => setNotice("")} aria-label="Fechar aviso"></button></div>}
      <section className="detail-card">
        <div className="detail-cover"><div className="detail-cover-icon"></div><div><span className="eyebrow">DETALHES DO REGISTRO</span><h1>{item.nome}</h1><p>Identificação do item #{item.id}</p></div><StatusBadge status={item.status} /></div>
        <div className="detail-content">
          <div className="detail-description"><span className="detail-label">Descrição</span><p>{item.descricao || "Nenhuma descrição informada."}</p></div>
          <div className="detail-info-grid">
            <div className="detail-info"><span className="detail-info-icon"></span><div><span className="detail-label">Categoria</span><strong>{item.categoria || "—"}</strong></div></div>
            <div className="detail-info"><span className="detail-info-icon"></span><div><span className="detail-label">Local encontrado</span><strong>{item.local || "—"}</strong></div></div>
            <div className="detail-info"><span className="detail-info-icon"></span><div><span className="detail-label">Data em que foi encontrado</span><strong>{formatDate(item.data_encontrado)}</strong></div></div>
            {item.status === "devolvido" && <div className="detail-info"><span className="detail-info-icon"></span><div><span className="detail-label">Devolvido para</span><strong>{item.devolvido_para || "Não informado"}</strong><small>Data da devolução: {formatDate(item.data_devolucao)}</small></div></div>}
          </div>
          <div className="detail-actions">
            <Link to={`/editar/${id}`} className="button button-secondary"> Editar</Link>
            <button className="button button-danger-outline" onClick={deleteItem} disabled={saving}> Excluir</button>
            {item.status !== "devolvido" && <button className="button button-primary" onClick={() => setShowReturn(showReturn ? false : true)}> Marcar como devolvido</button>}
          </div>
          {showReturn && <form className="return-form" onSubmit={returnItem}><label className="field">Nome de quem recebeu <span className="required">*</span><input value={returnName} onChange={(e) => setReturnName(e.target.value)} placeholder="Nome completo da pessoa" required /></label><div className="return-actions"><button type="button" className="button button-secondary" onClick={() => setShowReturn(false)}>Cancelar</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? "Confirmando..." : "Confirmar devolução"}</button></div></form>}
        </div>
      </section>
    </div>
  );
}

export default DetailPage;