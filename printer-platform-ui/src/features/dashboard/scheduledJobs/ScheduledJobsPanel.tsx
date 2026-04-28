import "./ScheduledJobsPanel.css";
import { Badge } from "@/components/badge/Badge";
import { SCHEDULED } from "@/mocks/scheduled.mock";
import { useNavigate } from "react-router-dom";

export function ScheduledJobsPanel() {
  const navigate = useNavigate();

  return (
    <div className="scheduled-jobs">
      {/* header */}
      <div className="scheduled-header">
        <h3>Upcoming Scheduled Jobs</h3>

        <button className="link-btn" onClick={() => navigate("/jobs")}>
          View all
        </button>
      </div>

      {/* list */}
      <div className="scheduled-list">
        {SCHEDULED.map((s, i) => (
          <div key={i} className="scheduled-item">
            <div className="icon">📅</div>

            <div className="content">
              <div className="meta">
                {s.date} · {s.time}
              </div>

              <div className="file">{s.file}</div>

              <div className="printer">{s.printer}</div>
            </div>

            <Badge status="SCHEDULED" />
          </div>
        ))}
      </div>

      <button className="link-btn bottom" onClick={() => navigate("/jobs")}>
        View all scheduled jobs →
      </button>
    </div>
  );
}