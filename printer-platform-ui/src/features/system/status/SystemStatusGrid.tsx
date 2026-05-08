import useSWR from "swr";
import { getHealth, getWorkers, getQueueMetrics } from "@/services/system";
import "./SystemStatusGrid.css";

export function SystemStatusGrid() {
  const { data: health } = useSWR('/system/health', getHealth, { refreshInterval: 10000 })
  const { data: workers } = useSWR('/system/workers', getWorkers, { refreshInterval: 10000 })
  const { data: queue } = useSWR('/system/queue', getQueueMetrics, { refreshInterval: 5000 })

  const workerStatus = workers?.[0]
  const lagSeconds = workerStatus?.lag 
    ? parseFloat(workerStatus.lag.toString())
    : null

  const workerLabel = !workerStatus 
    ? "UNKNOWN"
    : lagSeconds !== null && lagSeconds < 60 
      ? "RUNNING" 
      : "STALE"

  const stats = [
    { 
      label: "Worker", 
      value: workerLabel,
      healthy: workerLabel === "RUNNING"
    },
    { 
      label: "Queue Size", 
      value: queue ? String(queue.queued + queue.ready_to_queue) : "—",
      healthy: true
    },
    { 
      label: "CUPS", 
      value: health?.checks.cups ? "CONNECTED" : "DISCONNECTED",
      healthy: health?.checks.cups ?? false
    },
    { 
      label: "Database", 
      value: health?.checks.database ? "HEALTHY" : "UNHEALTHY",
      healthy: health?.checks.database ?? false
    },
  ]

  return (
    <div className="systemGrid">
      {stats.map((s) => (
        <div key={s.label} className="systemGrid__card">
          <div className="systemGrid__label">{s.label}</div>
          <div className="systemGrid__value">
            <span className={`dot ${s.healthy ? "dot--healthy" : "dot--unhealthy"}`} />
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}