import { Link } from "react-router-dom";
import { valorOpcao } from "../services/format";

// Este formulário é usado tanto no cadastro quanto na edição.
function ItemForm({ dados, setDados, categorias, locais, salvar, salvando, editando }) {
  function alterar(evento) {
    const { name, value } = evento.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  return (
    <form className="form-card" onSubmit={salvar}>
      <div className="form-section-title">
        <h2>Informações do objeto</h2>
        <p>Preencha todos os campos para {editando ? "atualizar" : "registrar"} o item.</p>
      </div>

      <div className="form-grid">
        <label className="field field-full">
          Nome <span className="required">*</span>
          <input name="nome" value={dados.nome} onChange={alterar} required placeholder="Ex.: Garrafa de água azul" />
        </label>

        <label className="field field-full">
          Descrição <span className="required">*</span>
          <textarea name="descricao" value={dados.descricao} onChange={alterar} required rows="4" placeholder="Cor, marca e outras características" />
        </label>

        <label className="field">
          Categoria <span className="required">*</span>
          <select name="categoria" value={dados.categoria} onChange={alterar} required>
            <option value="">Selecione a categoria</option>
            {categorias.map((opcao) => {
              const valor = valorOpcao(opcao);
              return <option key={valor} value={valor}>{valor}</option>;
            })}
          </select>
        </label>

        <label className="field">
          Local <span className="required">*</span>
          <select name="local" value={dados.local} onChange={alterar} required>
            <option value="">Selecione o local</option>
            {locais.map((opcao) => {
              const valor = valorOpcao(opcao);
              return <option key={valor} value={valor}>{valor}</option>;
            })}
          </select>
        </label>

        <label className="field field-full">
          Data em que foi encontrado <span className="required">*</span>
          <input type="date" name="data_encontrado" value={dados.data_encontrado} onChange={alterar} required />
        </label>
      </div>

      <div className="form-actions">
        <Link className="button button-secondary" to="/">Cancelar</Link>
        <button type="submit" className="button button-primary" disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar item"}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;