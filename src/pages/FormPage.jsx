import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api, { getApiError, getCategorias, getLocais } from "../services/api.js";
import { getItemId } from "../services/format.js";

import ItemForm from "../componentes/ItemForm.jsx";
import { Loading } from "../componentes/PageStates.jsx";


function FormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = mode === "edit";
  const [initial, setInitial] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(editando);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadDadosForm() {
    setLoading(true);
    setError("");
    try {
      const [categoriesData, locationsData] = await Promise.all([
        getCategorias(),
        getLocais(),
      ]);
      setCategories(categoriesData);
      setLocations(locationsData);
      if (editando) {
        const itemResponse = await api.get(`/itens/${id}`);
        setInitial(itemResponse.data);
      }
    } catch (error) {
      setError(getApiError(error));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDadosForm();
  }, [id, editando]);

  async function salvarItem(data) {
    setSaving(true);
    setError("");
    try {
      let response;
      if (editando) {
        response = await api.put(`/itens/${id}`, data);
      } else {
        response = await api.post("/itens", data);
      }
      const savedId = getItemId(response.data) || id;
      navigate(savedId ? `/item/${savedId}` : "/");
    } catch (error) {
      setError(getApiError(error));
    }
    setSaving(false);
  }

  if (loading) return <Loading text={editando ? "Carregando item..." : "Preparando formulário..."} />;

  return (
    <div className="narrow-page">
      <Link to={editando ? `/item/${id}` : "/"} className="back-link"> {editando ? "Voltar para o detalhe" : "Voltar para os itens"}</Link>
      <div className="form-page-heading">
        <span className="form-heading-icon">{editando ? "Editar" : "Novo"}</span>

        <div>
          <h1>{editando ? "Editar item" : "Cadastrar item"}</h1>
          <p>{editando ? "Atualize as informações do objeto encontrado." : "Registre um objeto encontrado."}</p>
        </div>
      </div>

      {error && <div className="notice error">
        {error}
        <button className="icon-button" onClick={() => setError("")} aria-label="Fechar aviso"></button>
      </div>}
      
      <ItemForm 
        key={`${mode}-${id || "new"}`} 
        initialValues={initial} 
        categories={categories} 
        locations={locations} 
        onSubmit={salvarItem} 
        onCancel={() => navigate(editando ? `/item/${id}` : "/")} 
        submitting={saving} />
    </div>
  );
}

export default FormPage;