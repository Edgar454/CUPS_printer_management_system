import { useState } from "react";

import { JobsPageHeader } from "@/features/jobs/header/JobsPageHeader";
import { IncomingFilesPanel } from "@/features/jobs/incomingFiles/IncomingFilesPanel";
import { JobHistoryTable } from "@/features/jobs/history/JobHistoryTable";
import { SchedulePrintModal } from "@/features/jobs/scheduleModal/SchedulePrintModal";

import { JOBS } from "@/mocks/jobs.mock";
import { PRINTERS } from "@/mocks/printers.mock";

import type { Job } from "@/features/jobs/jobHistory/JobHistoryTable";

import "./Jobs.css";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  //TODO: incoming files should also come from an API, but for now we can hardcode some data to work with.
  const incoming = [
    { name: "report.pdf", source: "FileBrowser", status: "READY" },
    { name: "invoice_batch.pdf", source: "API Upload", status: "READY" },
  ];

  // ───── actions ─────
  const handleRetry = (job: Job) => {
    console.log("retry", job);
  };

  const handleCancel = (job: Job) => {
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleSchedule = (file: any) => {
    setSelectedFile(file.name);
    setShowSchedule(true);
  };

  const handleConfirmSchedule = (data: any) => {
    console.log("schedule confirmed", data);
  };

  return (
    <div className="jobsPage">

      {/* header */}
      <JobsPageHeader
        onRefresh={() => console.log("refresh jobs")}
        onUpload={() => console.log("upload file")}
      />

      {/* incoming files */}
      <IncomingFilesPanel
        files={incoming}
        printers={PRINTERS}
        onPrintNow={(file, printer) =>
          console.log("print now", file, printer)
        }
        onSchedule={handleSchedule}
        onPreview={(file) => console.log("preview", file)}
      />

      {/* history */}
      <JobHistoryTable
        jobs={jobs}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />

      {/* modal */}
      <SchedulePrintModal
        open={showSchedule}
        fileName={selectedFile}
        printers={PRINTERS}
        onClose={() => setShowSchedule(false)}
        onConfirm={handleConfirmSchedule}
      />
    </div>
  );
}