function formatDate(value) {
  if (!value) {
    return "—";
  }

  const parts = value.split("-");
  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function statusLabel(status) {
  return status === "devolvido" ? "Devolvido" : "Aguardando";
}

function getItemId(item) {
  if (item && item.id) {
    return item.id;
  }
  if (item && item._id) {
    return item._id;
  }
  return null;
}

export { formatDate, statusLabel, getItemId };
