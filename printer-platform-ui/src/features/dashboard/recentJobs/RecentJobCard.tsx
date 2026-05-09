import "./RecentJobsPanel.css";
import type { Job } from "@/types/job";
import { timeAgo } from "@/utils/time_features";
import { Badge } from "@/components/badge/Badge";


export function RecentJobCard({ job }: { job: Job }) {
  return (
    <tr>
      <td className="mono">#{job.id}</td>
      <td className="fileCell" title={job.file_name}>
        {job.file_name}
      </td>
      <td>{job.printer_name}</td>
      <td>
        <Badge status={job.status} />
      </td>
      <td className="muted">{timeAgo(job.created_at)}</td>
    </tr>
  );
}