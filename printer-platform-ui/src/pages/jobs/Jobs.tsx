import { useState } from "react";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";

import { JobsPageHeader } from "@/features/jobs/header/JobsPageHeader";
import { IncomingFilesPanel } from "@/features/jobs/incomingFiles/IncomingFilesPanel";
import { JobHistoryTable } from "@/features/jobs/history/JobHistoryTable";
import { SchedulePrintModal } from "@/features/jobs/scheduleModal/SchedulePrintModal";

import { getJobs, cancelJob, retryJob, submitJob } from "@/services/jobs";
import { getPrinters } from "@/services/printers";
import { getFiles } from "@/services/files";
import type { Job, JobListResponse } from "@/types/job";
import type { Printer } from "@/types/printer";

import "./Jobs.css";

export default function JobsPage() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<JobListResponse>(
    '/jobs/',
    () => getJobs({ limit: 50 }),
    { refreshInterval: 10000, keepPreviousData: true }
  )

  const { data: printers } = useSWR<Printer[]>('/printers/', getPrinters)

  const { data: files } = useSWR<string[]>(
    '/files/',
    () => getFiles(),
    { refreshInterval: 30000, keepPreviousData: true }
  )

  const incoming = (files ?? []).map(name => ({ name, source: "File Storage" }))

  const handleRetry = async (job: Job) => {
    await retryJob(job.id, uuidv4())
    mutate('/jobs/')
  }

  const handleCancel = async (job: Job) => {
    await cancelJob(job.id, uuidv4())
    mutate('/jobs/')
  }

  const handlePrintNow = async (file: { name: string }, printerName: string) => {
    const printer = printers?.find(p => p.name === printerName)
    if (!printer) return

    await submitJob({
      file_name: file.name,
      file_path: file.name,
      printer_id: printer.id,
      client_request_id: uuidv4(),
    })
    mutate('/jobs/')
  }

  const handleSchedule = (file: any) => {
    setSelectedFile(file.name);
    setShowSchedule(true);
  };

  const handleConfirmSchedule = async (data: any) => {
    const printer = printers?.find(p => p.name === data.printer)
    if (!printer) return

    await submitJob({
      file_name: data.fileName,
      file_path: data.fileName,
      printer_id: printer.id,
      client_request_id: uuidv4(),
      scheduled_at: `${data.date}T${data.time}:00`,
    })
    mutate('/jobs/')
    setShowSchedule(false)
  }

  return (
    <div className="jobsPage">
      <JobsPageHeader
        onRefresh={() => mutate('/jobs/')}
        onUploadSuccess={() => mutate('/files/')}
      />

      <IncomingFilesPanel
        files={incoming}
        printers={printers ?? []}
        onPrintNow={handlePrintNow}
        onSchedule={handleSchedule}
        onPreview={(file) => window.open(`/api/files/${file.name}`, '_blank')}
      />

      <JobHistoryTable
        jobs={data?.items ?? []}
        isLoading={isLoading}
        error={!!error}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />

      <SchedulePrintModal
        open={showSchedule}
        fileName={selectedFile}
        printers={printers ?? []}
        onClose={() => setShowSchedule(false)}
        onConfirm={handleConfirmSchedule}
      />
    </div>
  );
}