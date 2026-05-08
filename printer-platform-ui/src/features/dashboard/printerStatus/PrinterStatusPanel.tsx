import "./PrinterStatusPanel.css";
import useSWR from "swr";
import { getPrinters } from "@/services/printers";
import { Badge } from "@/components/badge/Badge";
import { useNavigate } from "react-router-dom";
import type { Printer } from "@/types/printer";

export function PrinterStatusPanel() {
  const navigate = useNavigate();
  const { data: printers, error, isLoading } = useSWR<Printer[]>('/printers/', getPrinters, {
    refreshInterval: 10000,
  })

  return (
    <div className="printer-panel">
      <div className="printer-header">
        <h3>Printer Status</h3>
        <button className="link-btn" onClick={() => navigate("/printers")}>
          View all
        </button>
      </div>

      <div className="printer-list">
        {isLoading && <div className="printer-list__loading">⏳ Loading...</div>}
        {error && <div className="printer-list__error">⚠️ Failed to load printers</div>}
        {!isLoading && !error && printers?.map((p) => (
          <div key={p.id} className="printer-item">
            <span className="printer-icon">🖨️</span>
            <div className="printer-info">
              <div className="name">{p.name}</div>
              <div className="ip">{p.cups_uri}</div>
            </div>
            <Badge status={p.status} />
            <div className="queue">
              {p.queue_count > 0 ? `${p.queue_count} job(s)` : "Idle"}
            </div>
          </div>
        ))}
      </div>

      <button className="link-btn bottom" onClick={() => navigate("/printers")}>
        Manage printers →
      </button>
    </div>
  );
}