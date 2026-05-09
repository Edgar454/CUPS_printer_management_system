import "./JobHistoryTable.css";
import type { Job } from "@/types/job";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/btn/Button";
import { timeAgo } from "@/utils/time_features";

interface Props {
  job: Job ;
  onRetry?: (job: Job) => void;
  onCancel?: (job: Job) => void;
}


export function JobRow({ job , onRetry , onCancel }: Props){
    return(
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

    )
}