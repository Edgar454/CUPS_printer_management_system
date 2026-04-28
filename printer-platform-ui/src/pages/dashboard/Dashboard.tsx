import "./Dashboard.css";

import { StatsGrid } from "@/features/dashboard/statsGrid/StatsGrid";
import { RecentJobsPanel } from "@/features/dashboard/recentJobs/RecentJobsPanel";
import { ScheduledJobsPanel } from "@/features/dashboard/scheduledJobs/ScheduledJobsPanel";
import { PrinterStatusPanel } from "@/features/dashboard/printerStatus/PrinterStatusPanel";
import { QuickActionsPanel } from "@/features/dashboard/quickActions/QuickActionsPanel";
import { SystemHealthPanel } from "@/features/dashboard/systemHealthPanel/SystemHealthPanel";

import { JOBS } from "@/mocks/jobs.mock";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <StatsGrid />

      <div className="dashboard-grid">
        <RecentJobsPanel jobs={JOBS} />
        <ScheduledJobsPanel />
      </div>

      <div className="dashboard-bottom">
        <PrinterStatusPanel />
        <QuickActionsPanel />
        <SystemHealthPanel />
      </div>
    </div>
  );
}