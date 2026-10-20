import { statusLabel } from "../services/format.js";

function StatusBadge({ status }) {
  const returned = status === "devolvido";
  const Icon = returned ? CheckCircle2 : Clock3;
  return <span className={`status-badge ${returned ? "status-returned" : "status-waiting"}`}>{statusLabel(status)}</span>;
}

export default StatusBadge;