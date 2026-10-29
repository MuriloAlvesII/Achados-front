import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import ItemForm from "../componentes/ItemForm";
import PageStates from "../componentes/PageStates";
import { extrairLista, mostrarErro } from "../services/format";

const camposVazios = {
  nome: "",
  descricao: "",
  categoria: "",
  local: "",
  data_encontrado: "",
};

function Formulario() {
  const { id } = useParams();
  const editando = Boolean(id);
  const [dados, setDados] = useState(camposVazios);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarFormulario() {
      setCarregando(true);
      setErro("");

      try {
        const respostaCategorias = await api.get("/categorias");
        const respostaLocais = await api.get("/locais");

        if (ativo) {
          setCategorias(extrairLista(respostaCategorias.data, "categorias"));
          setLocais(extrairLista(respostaLocais.data, "locais"));
        }

        if (editando) {
          const respostaItem = await api.get(`/itens/${id}`);
          const item = respostaItem.data;

          if (ativo) {
            setDados({
              nome: item.nome || "",
              descricao: item.descricao || "",
              categoria: item.categoria || "",
              local: item.local || "",
              data_encontrado: item.data_encontrado?.slice(0, 10) || "",
            });
          }
        } else if (ativo) {
          setDados({ ...camposVazios });
        }
      } catch (error) {
        if (ativo) setErro(mostrarErro(error));
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarFormulario();
    return () => { ativo = false; };
  }, [id, editando]);

  async function salvar(evento) {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      if (editando) {
        await api.put(`/itens/${id}`, dados);
      } else {
        await api.post("/itens", dados);
        setDados({ ...camposVazios });
      }

      setSucesso(editando ? "Item atualizado com sucesso!" : "Item cadastrado com sucesso!");
    } catch (error) {
      setErro(mostrarErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="narrow-page">
      <Link to="/" className="back-link">← Voltar para a lista</Link>

      <div className="form-page-heading">
        <span className="eyebrow eyebrow-dark">CADASTRO DE ACHADOS</span>
        <h1>{editando ? "Editar item" : "Novo item"}</h1>
        <p>{editando ? "Atualize as informações do objeto." : "Registre um objeto encontrado no campus."}</p>
      </div>

      {carregando ? (
        <PageStates titulo="Carregando formulário" mensagem="Buscando categorias e locais..." />
      ) : (
        <>
          {erro && <div className="notice error" role="alert">{erro}</div>}
          {sucesso && (
            <div className="notice success" role="status">
              <span>{sucesso}</span>
              <Link to="/">Ver lista</Link>
            </div>
          )}
          <ItemForm
            dados={dados}
            setDados={setDados}
            categorias={categorias}
            locais={locais}
            salvar={salvar}
            salvando={salvando}
            editando={editando}
          />
        </>
      )}
    </main>
  );
}

export default Formulario;