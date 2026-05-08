import "./JobHistoryTable.css";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/btn/Button";
import type { Job } from "@/types/job";
import { timeAgo } from "@/utils/time_features";

interface Props {
  jobs: Job[];
  isLoading?: boolean;
  error?: boolean;
  onRetry?: (job: Job) => void;
  onCancel?: (job: Job) => void;
}



export function JobHistoryTable({ jobs, isLoading, error, onRetry, onCancel }: Props) {
  return (
    <div className="jobHistoryTable">
      <h3 className="jobHistoryTable__title">Job History</h3>

      <table className="jobHistoryTable__table">
        <thead>
          <tr>
            {["Job ID", "File", "Printer", "Status", "Retries", "Time", "Actions"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr><td colSpan={7} className="muted">⏳ Loading jobs...</td></tr>
          )}
          {error && (
            <tr><td colSpan={7} className="muted">⚠️ Failed to load jobs</td></tr>
          )}
          {!isLoading && !error && jobs.map((job) => (
            <tr key={job.id}>
              <td className="mono">#{job.id.slice(0, 8)}</td>
              <td className="fileCell">{job.file_name}</td>
              <td>{job.printer_name ?? "—"}</td>
              <td><Badge status={job.status} /></td>
              <td className="muted">{job.retry_count}</td>
              <td className="muted">{timeAgo(job.created_at)}</td>
              <td className="actions">
                {job.status === "FAILED" && (
                  <Button small variant="secondary" onClick={() => onRetry?.(job)}>
                    Retry
                  </Button>
                )}
                {(job.status === "SCHEDULED" || job.status === "QUEUED") && (
                  <Button small variant="danger" onClick={() => onCancel?.(job)}>
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}