import { statusLabel } from "../services/format.js";

function StatusBadge({ status }) {
  const returned = status === "devolvido";

  return (
    <span className={`status-badge ${returned ? "status-returned" : "status-waiting"}`}>
      {statusLabel(status)}
    </span>
  );
}

export default StatusBadge;