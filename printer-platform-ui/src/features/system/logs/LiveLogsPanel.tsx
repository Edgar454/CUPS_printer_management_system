import { useEffect, useRef, useState } from "react";
import "./LiveLogsPanel.css";

const types = ["INFO", "INFO", "INFO", "WARN"];

const msgs = [
  "Worker heartbeat OK",
  "Job queue checked",
  "CUPS ping OK",
  "Slow response from Canon printer",
  "DB connection pool healthy",
];

export function LiveLogsPanel({ logs, setLogs }: any) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ["INFO", "INFO", "WARN"];

      const msgs = [
        "Worker heartbeat OK",
        "Job queue checked",
        "CUPS ping OK",
        "DB connection healthy",
      ];

      setLogs((prev: any) => [
        ...prev.slice(-10),
        {
          type: types[Math.floor(Math.random() * types.length)],
          msg: msgs[Math.floor(Math.random() * msgs.length)],
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const color: any = {
    INFO: "#22c55e",
    WARN: "#f59e0b",
    ERROR: "#ef4444",
  };

  return (
    <div className="logsPanel">
      <div className="logsPanel__header">
        <h3>Live Logs</h3>
        <span className="liveIndicator">● LIVE</span>
      </div>

      <div ref={logRef} className="logsPanel__body">
        {logs.map((l, i) => (
          <div key={i} className="logLine">
            <span className="time">{l.time}</span>
            <span className="type" style={{ color: color[l.type] }}>
              [{l.type}]
            </span>
            <span className="msg">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}