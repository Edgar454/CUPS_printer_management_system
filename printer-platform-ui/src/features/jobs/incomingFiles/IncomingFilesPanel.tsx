import "./IncomingFilesPanel.css";
import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/btn/Button";
import type { Printer } from "@/types/printer";

interface IncomingFile {
  name: string;
  source: string;
  status: string;
}

interface Props {
  files: IncomingFile[];
  printers: Printer[];
  onPrintNow?: (file: IncomingFile, printer: string) => void;
  onSchedule?: (file: IncomingFile) => void;
  onPreview?: (file: IncomingFile) => void;
}

export function IncomingFilesPanel({
  files,
  printers,
  onPrintNow,
  onSchedule,
  onPreview,
}: Props) {
  const onlinePrinters = printers.filter((p) => p.status === "ONLINE");

  return (
    <div className="incomingFilesPanel">
      <h3 className="incomingFilesPanel__title">Incoming Files</h3>

      {files.map((file, i) => (
        <div key={i} className="incomingFilesPanel__row">
          <span className="incomingFilesPanel__icon">📄</span>

          <div className="incomingFilesPanel__info">
            <div className="incomingFilesPanel__name">{file.name}</div>
            <div className="incomingFilesPanel__source">
              Source: {file.source}
            </div>
          </div>

          <Badge status={file.status === "READY" ? "SUCCESS" : file.status} />

          <select className="incomingFilesPanel__select">
            <option>Select Printer</option>
            {onlinePrinters.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="incomingFilesPanel__actions">
            <Button
              small
              onClick={() => onPrintNow?.(file, "")}
            >
              Print Now
            </Button>

            <Button
              small
              variant="secondary"
              onClick={() => onSchedule?.(file)}
            >
              Schedule
            </Button>

            <Button
              small
              variant="ghost"
              onClick={() => onPreview?.(file)}
            >
              Preview
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}