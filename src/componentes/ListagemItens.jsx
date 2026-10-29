
import { useEffect, useState } from "react";
import api from "../services/api";

function ListagemItens() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function buscarItens() {
      try {
        const resposta = await api.get("/itens");

        console.log("Resposta da API:", resposta.data);

        const dados = resposta.data;

        const lista = Array.isArray(dados)
          ? dados
          : dados?.itens;

        if (!Array.isArray(lista)) {
          throw new Error("Formato de resposta inesperado");
        }

        if (ativo) {
          setItens(lista);
        }
      } catch (error) {
        console.error(error);

        if (ativo) {
          setErro("Não foi possível carregar os itens.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarItens();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return <p>Carregando itens...</p>;
  }

  if (erro) {
    return <p role="alert">{erro}</p>;
  }

  if (itens.length === 0) {
    return <p>Nenhum item encontrado.</p>;
  }

  return (
    <section>
      <h2>Itens encontrados</h2>

      {itens.map((item) => (
        <div key={item.id}>
          <h3>{item.nome}</h3>
          <p>Categoria: {item.categoria}</p>
          <p>Local: {item.local}</p>
          <p>Status: {item.status}</p>
          <hr />
        </div>
      ))}
    </section>
  );
}

export default ListagemItens;