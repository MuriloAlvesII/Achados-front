import ItemCard from "../components/ItemCard";

import { useEffect, useState } from "react";
import api from "../services/api";

function Inicio() {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    async function carregarItens() {
      try {
        const resposta = await api.get("/itens");

        console.log(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar itens:", erro);
      }
    }

    carregarItens();
  }, []);

  return <h1>Achados e Perdidos</h1>;
}

export default Inicio;