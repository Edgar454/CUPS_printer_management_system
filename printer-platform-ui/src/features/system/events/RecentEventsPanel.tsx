import "./RecentEventsPanel.css";
import useSWR from "swr";
import { fetchRecentEvents } from "@/services/jobs";
import type { JobEvent } from "@/types/job";



const eventConfig: Record<string, { icon: string; color: string }> = {
  CREATED:            { icon: "⊕", color: "#22c55e" },
  QUEUED:             { icon: "◷", color: "#3b82f6" },
  SCHEDULED:          { icon: "📅", color: "#f59e0b" },
  PROCESSING_STARTED: { icon: "⚙️", color: "#3b82f6" },
  PRINTING_STARTED:   { icon: "🖨️", color: "#8b5cf6" },
  COMPLETED:          { icon: "✓", color: "#22c55e" },
  FAILED:             { icon: "!", color: "#ef4444" },
  CANCELLED:          { icon: "✕", color: "#6b7280" },
  RETRY:              { icon: "↺", color: "#f59e0b" },
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function RecentEventsPanel() {
  const { data: events, error, isLoading } = useSWR<JobEvent[]>(
    '/jobs/events',
    () => fetchRecentEvents(10),
    { refreshInterval: 5000, keepPreviousData: true }
  )

  return (
    <div className="eventsPanel">
      <h3>Recent Events</h3>

      {isLoading && <div className="eventsPanel__loading">⏳ Loading...</div>}
      {error && <div className="eventsPanel__error">⚠️ Failed to load events</div>}

      {!isLoading && !error && (events ?? []).map((e) => {
        const config = eventConfig[e.event_type] ?? { icon: "◈", color: "#999" }
        return (
          <div key={e.id} className="eventRow">
            <div className="icon" style={{ background: config.color + "20", color: config.color }}>
              {config.icon}
            </div>
            <div className="content">
              <div className="msg">
                {e.event_type.replace(/_/g, " ")}
                {e.error && <span className="error"> — {e.error}</span>}
              </div>
              <div className="time">{timeAgo(e.created_at)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}