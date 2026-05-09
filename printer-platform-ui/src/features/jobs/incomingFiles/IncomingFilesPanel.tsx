import "./IncomingFilesPanel.css";
import { useState } from "react";
import type { Printer } from "@/types/printer";
import { FileRow } from "./FileRow";


interface IncomingFile {
  name: string;
  source?: string;
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
  const [selectedPrinters, setSelectedPrinters] = useState<Record<string, string>>({});

  const handleSelect = (fileName: string, printer: string) => {
    setSelectedPrinters((prev) => ({ ...prev, [fileName]: printer }));
  };
  const onlinePrinters = printers.filter((p) => p.status === "ONLINE");

  return (
    <div className="incomingFilesPanel">
      <h3 className="incomingFilesPanel__title">Incoming Files</h3>

      {files.map((file, i) => (
         <FileRow 
            file={file} id={i} onlinePrinters={onlinePrinters}
            selectedPrinters={selectedPrinters} onSelectPrinter={handleSelect}
            onPrintNow={onPrintNow} onSchedule={onSchedule} onPreview={onPreview}
          />
      ))}
    </div>
  );
}