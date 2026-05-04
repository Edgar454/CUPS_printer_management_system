import { useState } from "react";

import { SystemStatusGrid } from "@/features/system/status/SystemStatusGrid";
import { LiveLogsPanel } from "@/features/system/logs/LiveLogsPanel";
import { RecentEventsPanel } from "@/features/system/events/RecentEventsPanel";

import "./SystemPage.css";

const initialLogs = [
  {
    type: "INFO",
    msg: "System initialized",
    time: new Date().toLocaleTimeString(),
  },
];

export default function SystemPage() {
  const [logs, setLogs] = useState(initialLogs);

  return (
    <div className="systemPage">
      <SystemStatusGrid />

      <div className="systemPage__grid">
        <LiveLogsPanel logs={logs} setLogs={setLogs} />
        <RecentEventsPanel />
      </div>
    </div>
  );
}