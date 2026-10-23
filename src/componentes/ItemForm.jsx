import { useEffect, useState } from "react";

function getOptionName(item, field) {
  if (typeof item === "string") return item;
  if (item && item[field]) return item[field];
  if (item && item.nome) return item.nome;
  if (item && item.name) return item.name;
  return "";
}

const emptyForm = {
  nome: "",
  descricao: "",
  categoria: "",
  local: "",
  data_encontrado: new Date().toISOString().slice(0, 10),
};

function ItemForm({ initialValues, categories, locations, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...emptyForm, ...(initialValues || {}) });
  const [customCategory, setCustomCategory] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  useEffect(() => {
    setForm({ ...emptyForm, ...(initialValues || {}) });
  }, [initialValues]);

  const categoryOptions = categories.map((item) => getOptionName(item, "categoria")).filter(Boolean);
  const locationOptions = locations.map((item) => getOptionName(item, "local")).filter(Boolean);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      categoria: form.categoria === "__custom" ? customCategory.trim() : form.categoria,
      local: form.local === "__custom" ? customLocation.trim() : form.local,
    });
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-section-title">
        <div>
          <h2>Informações do objeto</h2>
          <p>Preencha os dados para identificar o item encontrado.</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field field-full">Nome do item <span className="required">*</span>
          <input name="nome" value={form.nome} onChange={update} placeholder="Ex.: Garrafa térmica azul" required maxLength={120} />
        </label>

        <label className="field field-full">Descrição <span className="required">*</span>
          <textarea name="descricao" value={form.descricao} onChange={update} placeholder="Descreva características que ajudem a reconhecer o objeto..." rows={4} required maxLength={2000} />
        </label>

        <label className="field">Categoria <span className="required">*</span>
          <select name="categoria" value={form.categoria} onChange={update} required>
            <option value="">Selecione uma categoria</option>
            {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            <option value="__custom">Outra categoria...</option>
          </select>
          {form.categoria === "__custom" && <input className="field-extra" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Digite a categoria" required />}
        </label>

        <label className="field">Local encontrado <span className="required">*</span>
          <select name="local" value={form.local} onChange={update} required>
            <option value="">Selecione um local</option>
            {locationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            <option value="__custom">Outro local...</option>
          </select>
          {form.local === "__custom" && <input className="field-extra" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} placeholder="Digite o local" required />}
        </label>

        <label className="field">Data em que foi encontrado <span className="required">*</span>
          <input type="date" name="data_encontrado" value={form.data_encontrado} onChange={update} required />
        </label>
      </div>
      
      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel} disabled={submitting}> Cancelar</button>
        <button type="submit" className="button button-primary" disabled={submitting}> {submitting ? "Salvando..." : "Salvar item"}</button>
      </div>

    </form>
  );
}

export default ItemForm;