import { useEffect, useRef } from "react";
import useSWR from "swr";
import { getSystemLogs } from "@/services/system";
import "./LiveLogsPanel.css";

type LogLine = {
  raw: string;
  level: string;
  time: string;
  msg: string;
}

function parseLine(line: string): LogLine {
  // format: "2026-05-08 10:00:00,000 - name - LEVEL - message"
  const match = line.match(/^(\S+ \S+) - \S+ - (\w+) - (.+)$/)
  if (match) {
    return { raw: line, time: match[1], level: match[2], msg: match[3] }
  }
  return { raw: line, time: "", level: "INFO", msg: line }
}

const color: Record<string, string> = {
  INFO: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  CRITICAL: "#ef4444",
}

export function LiveLogsPanel() {
  const logRef = useRef<HTMLDivElement>(null);

  const { data } = useSWR('/system/logs', () => getSystemLogs(50), {
    refreshInterval: 5000,
    keepPreviousData: true,  // don't flash empty on refetch
  })

  const lines = (data?.logs ?? []).map(parseLine)

  // auto scroll to bottom on new logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [lines.length])

  return (
    <div className="logsPanel">
      <div className="logsPanel__header">
        <h3>Live Logs</h3>
        <span className="liveIndicator">● LIVE</span>
      </div>

      <div ref={logRef} className="logsPanel__body">
        {lines.map((l, i) => (
          <div key={i} className="logLine">
            <span className="time">{l.time}</span>
            <span className="type" style={{ color: color[l.level] ?? "#999" }}>
              [{l.level}]
            </span>
            <span className="msg">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}