import "./JobHistoryTable.css";
import type { Job } from "@/types/job";
import { JobRow } from "./JobRowCard";

interface Props {
  jobs: Job[];
  isLoading?: boolean;
  limit?: number ;
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
            <JobRow job={job} onRetry={onRetry} onCancel={onCancel}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}