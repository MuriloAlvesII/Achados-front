export function formatarData(data) {
  if (!data) return "Não informada";
  const partes = String(data).slice(0, 10).split("-");
  if (partes.length !== 3) return String(data);
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function extrairLista(dados, nome) {
  if (Array.isArray(dados)) return dados;
  if (Array.isArray(dados?.[nome])) return dados[nome];
  return [];
}

export function valorOpcao(opcao) {
  if (typeof opcao === "string") return opcao;
  return opcao?.nome || opcao?.valor || "";
}

export function mostrarErro(erro) {
  const detalhe = erro.response?.data?.detail;
  if (typeof detalhe === "string") return detalhe;
  if (Array.isArray(detalhe)) {
    return detalhe.map((item) => item.msg || "Campo inválido").join("; ");
  }
  if (erro.response?.status === 401) return "Chave inválida. Confira o arquivo .env.";
  return "Não foi possível completar a operação. Tente novamente.";
}