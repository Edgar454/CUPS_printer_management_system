import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/job";
import { RecentJobCard } from "./RecentJobCard";

import "./RecentJobsPanel.css";


interface Props {
  jobs: Job[];
  limit?: number;
}

export function RecentJobsPanel({ jobs , limit=10 }: Props) {
  const navigate = useNavigate();
  const visibleJobs = limit ? jobs.slice(0, limit) : jobs

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
          {visibleJobs.map((j) => (
            <RecentJobCard job={j}/>
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