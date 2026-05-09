import "./IncomingFilesPanel.css";
import { useState } from "react";
import { mutate } from "swr"
import type { Printer } from "@/types/printer";
import { deleteFile } from "@/services/files"
import { Button } from "@/components/btn/Button";
import { ConfirmModal } from "@/components/confirmModal/ConfirmModal";

interface IncomingFile {
  name: string;
  source?: string;
}

interface Props {
  file: IncomingFile;
  id: number;
  onlinePrinters: Printer[];
  selectedPrinters: Record<string, string>;
  onSelectPrinter: (file: string , target: string) => void;
  onPrintNow?: (file: IncomingFile, printer: string) => void;
  onSchedule?: (file: IncomingFile) => void;
  onPreview?: (file: IncomingFile) => void;
}

export function FileRow({file , id ,  onlinePrinters ,selectedPrinters,onSelectPrinter, onPrintNow , onSchedule ,onPreview }:Props){
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        await deleteFile(file.name);
        mutate('/files/');
        setShowConfirm(false);
    }

    return (
        <>
            <div key={id} className="incomingFilesPanel__row">
                <span className="incomingFilesPanel__icon">📄</span>
                    <div className="incomingFilesPanel__info">
                        <div className="incomingFilesPanel__name">{file.name}</div>
                        <div className="incomingFilesPanel__source">
                        Source: {file.source}
                        </div>
                    </div>
                    <select
                        className="incomingFilesPanel__select"
                        value={selectedPrinters[file.name] || ""}
                        onChange={(e) => onSelectPrinter(file.name, e.target.value)}
                    >
                        <option value="">Select Printer</option>
                        {onlinePrinters.map((p) => (
                            <option key={p.id} value={p.name}>
                            {p.name}
                            </option>
                        ))}
                    </select>
                    <div className="incomingFilesPanel__actions">
                    <Button
                        small
                        onClick={() => onPrintNow?.(file, selectedPrinters[file.name] || "")}
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
                    <Button
                    small
                    variant="danger"
                    onClick={() => setShowConfirm(true)}
                    >
                    Delete
                    </Button>

                </div>
            </div>
            <ConfirmModal
                open={showConfirm}
                title="Delete File"
                message={`Are you sure you want to delete "${file.name}"? This cannot be undone.`}
                onConfirm={handleDelete}
                onClose={() => setShowConfirm(false)}
            />
        </>
    )
}