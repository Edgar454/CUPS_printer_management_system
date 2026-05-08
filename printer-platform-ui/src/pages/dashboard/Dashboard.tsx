import "./Dashboard.css";

import useSWR from "swr";


import { StatsGrid } from "@/features/dashboard/statsGrid/StatsGrid";
import { RecentJobsPanel } from "@/features/dashboard/recentJobs/RecentJobsPanel";
import { ScheduledJobsPanel } from "@/features/dashboard/scheduledJobs/ScheduledJobsPanel";
import { PrinterStatusPanel } from "@/features/dashboard/printerStatus/PrinterStatusPanel";
import { QuickActionsPanel } from "@/features/dashboard/quickActions/QuickActionsPanel";
import { SystemHealthPanel } from "@/features/dashboard/systemHealthPanel/SystemHealthPanel";

import type {JobListResponse } from "@/types/job";
import { getJobs } from "@/services/jobs";

export default function Dashboard() {
  const { data } = useSWR<JobListResponse>(
    '/jobs/',
    () => getJobs({ limit: 50 }),
    { refreshInterval: 10000, keepPreviousData: true }
  )

  return (
    <div className="dashboard">
      <StatsGrid />

      <div className="dashboard-grid">
        <RecentJobsPanel jobs={data?.items ?? []} />
        <ScheduledJobsPanel jobs={data?.items ?? []} />
      </div>

      <div className="dashboard-bottom">
        <PrinterStatusPanel />
        <QuickActionsPanel />
        <SystemHealthPanel />
      </div>
    </div>
  );
}