import "./ScheduledJobsPanel.css";
import { Badge } from "@/components/badge/Badge";
import type { Job } from "@/types/job";
import { useNavigate } from "react-router-dom";
import { formatScheduledAt } from "@/utils/time_features";

interface Props {
  jobs: Job[];
}

export function ScheduledJobsPanel({ jobs }: Props) {
  const navigate = useNavigate();
  const scheduled = jobs?.filter((j) => j.status === "SCHEDULED") ?? [];

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
        {scheduled.map((s, i) => (
          <div key={i} className="scheduled-item">
            <div className="icon">📅</div>

            <div className="content">
              <div className="meta">
                {formatScheduledAt(s.scheduled_at)}
              </div>

              <div className="file">{s.file_name}</div>

              <div className="printer">{s.printer_name}</div>
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