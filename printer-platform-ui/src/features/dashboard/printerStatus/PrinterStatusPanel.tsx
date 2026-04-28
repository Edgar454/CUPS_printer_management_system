import "./PrinterStatusPanel.css";
import { PRINTERS } from "@/mocks/printers.mock";
import { Badge } from "@/components/badge/Badge";
import { useNavigate } from "react-router-dom";

export function PrinterStatusPanel() {
  const navigate = useNavigate();

  return (
    <div className="printer-panel">
      {/* header */}
      <div className="printer-header">
        <h3>Printer Status</h3>

        <button className="link-btn" onClick={() => navigate("/printers")}>
          View all
        </button>
      </div>

      {/* list */}
      <div className="printer-list">
        {PRINTERS.map((p) => (
          <div key={p.id} className="printer-item">
            <span className="printer-icon">🖨️</span>

            <div className="printer-info">
              <div className="name">{p.name}</div>
              <div className="ip">{p.ip}</div>
            </div>

            <Badge status={p.status} />

            <div className="queue">
              {p.queue > 0 ? `${p.queue} job` : "Idle"}
            </div>
          </div>
        ))}
      </div>

      <button
        className="link-btn bottom"
        onClick={() => navigate("/printers")}
      >
        Manage printers →
      </button>
    </div>
  );
}