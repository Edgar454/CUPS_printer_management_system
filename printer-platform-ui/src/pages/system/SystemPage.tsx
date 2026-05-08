import { SystemStatusGrid } from "@/features/system/status/SystemStatusGrid";
import { LiveLogsPanel } from "@/features/system/logs/LiveLogsPanel";
import { RecentEventsPanel } from "@/features/system/events/RecentEventsPanel";

import "./SystemPage.css";


export default function SystemPage() {

  return (
    <div className="systemPage">
      <SystemStatusGrid />

      <div className="systemPage__grid">
        <LiveLogsPanel />
        <RecentEventsPanel />
      </div>
    </div>
  );
}