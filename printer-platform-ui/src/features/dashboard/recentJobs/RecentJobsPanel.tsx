import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/badge/Badge";
import type { Job } from "@/types/job";
import "./RecentJobsPanel.css";


interface Props {
  jobs: Job[];
}

export function RecentJobsPanel({ jobs }: Props) {
  const navigate = useNavigate();

  return (
    <div className="recentJobsPanel">
      <div className="recentJobsPanel__header">
        <h3>Recent Jobs</h3>

        <button
          className="linkButton"
          onClick={() => navigate("/jobs")}
        >
          View all jobs →
        </button>
      </div>

      <table className="recentJobsPanel__table">
        <thead>
          <tr>
            {["Job ID", "File Name", "Printer", "Status", "Time"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td className="mono">#{j.id}</td>

              <td className="fileCell" title={j.file}>
                {j.file}
              </td>

              <td>{j.printer}</td>

              <td>
                <Badge status={j.status} />
              </td>

              <td className="muted">{j.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="linkButton bottomLink"
        onClick={() => navigate("/jobs")}
      >
        View full job history →
      </button>
    </div>
  );
}