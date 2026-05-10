import "./StatsGrid.css";
import useSWR from "swr";
import { getHealth, getWorkers, getStats, getQueueMetrics } from "@/services/system";
import { getPrinters } from "@/services/printers";
import type { HealthResponse, WorkerStatus, SystemStats, QueueMetrics } from "@/types/system";
import type { Printer } from "@/types/printer";

export function StatsGrid() {
  const { data: health } = useSWR<HealthResponse>('/system/health', getHealth, { refreshInterval: 10000 })
  const { data: workers } = useSWR<WorkerStatus[]>('/system/workers', getWorkers, { refreshInterval: 10000 })
  const { data: stats } = useSWR<SystemStats>('/system/stats', getStats, { refreshInterval: 10000 })
  const { data: queue } = useSWR<QueueMetrics>('/system/queue', getQueueMetrics, { refreshInterval: 5000 })
  const { data: printers } = useSWR<Printer[]>('/printers/', getPrinters, { refreshInterval: 10000 })

  const worker = workers?.[0]
  const workerHealthy = worker ? parseFloat(worker.lag.toString()) < 60 : false
  const systemHealthy = health?.status === "ok" && workerHealthy

  const onlineCount = printers?.filter(p => p.status === "ONLINE").length ?? 0
  const offlineCount = printers?.filter(p => p.status !== "ONLINE").length ?? 0

  const cards = [
    {
      label: "System Status",
      value: systemHealthy ? "Healthy" : "Degraded",
      sub: systemHealthy ? "All systems operational" : "Check system health",
      accent: systemHealthy ? "#22c55e" : "#ef4444",
      icon: systemHealthy ? "✓" : "!"
    },
    {
      label: "Printers",
      value: printers?.length ?? 0,
      sub: `${onlineCount} online · ${offlineCount} offline`,
      accent: "#3b82f6",
      icon: "⎙"
    },
    {
      label: "Today's Jobs",
      value: (stats?.completed ?? 0) + (stats?.failed ?? 0),
      sub: `${stats?.completed ?? 0} success · ${stats?.failed ?? 0} failed`,
      accent: "#8b5cf6",
      icon: "≡"
    },
    {
      label: "Scheduled",
      value: queue?.scheduled ?? 0,
      sub: "Upcoming jobs",
      accent: "#f59e0b",
      icon: "◷"
    },
    {
      label: "Failed Jobs",
      value: stats?.failed ?? 0,
      sub: stats?.failed ? "Needs attention" : "All good",
      accent: stats?.failed ? "#ef4444" : "#22c55e",
      icon: "!"
    },
  ]

  return (
    <div className="stats-grid">
      {cards.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-header">
            <div
              className="stat-icon"
              style={{ background: s.accent + "18", color: s.accent }}
            >
              {s.icon}
            </div>
            <span className="stat-label">{s.label}</span>
          </div>
          <div className="stat-value">{s.value}</div>
          <div className="stat-sub">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}