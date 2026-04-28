import "./JobHistoryTable.css";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/btn/Button";

export interface Job {
  id: number;
  file: string;
  printer: string;
  status: string;
  time: string;
}

interface Props {
  jobs: Job[];
  onRetry?: (job: Job) => void;
  onCancel?: (job: Job) => void;
}

export function JobHistoryTable({ jobs, onRetry, onCancel }: Props) {
  return (
    <div className="jobHistoryTable">
      <h3 className="jobHistoryTable__title">Job History</h3>

      <table className="jobHistoryTable__table">
        <thead>
          <tr>
            {["Job ID", "File", "Printer", "Status", "Time", "Actions"].map(
              (h) => (
                <th key={h}>{h}</th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="mono">#{job.id}</td>

              <td className="fileCell">{job.file}</td>

              <td>{job.printer}</td>

              <td>
                <Badge status={job.status} />
              </td>

              <td className="muted">{job.time}</td>

              <td className="actions">
                {job.status === "FAILED" && (
                  <Button
                    small
                    variant="secondary"
                    onClick={() => onRetry?.(job)}
                  >
                    Retry
                  </Button>
                )}

                {job.status === "SCHEDULED" && (
                  <Button
                    small
                    variant="danger"
                    onClick={() => onCancel?.(job)}
                  >
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