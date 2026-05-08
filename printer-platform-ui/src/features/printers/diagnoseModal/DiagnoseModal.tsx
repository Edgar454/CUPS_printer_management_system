import { Modal } from "@/components/modal/Modal";
import type { PrinterDiagnosisResponse } from "@/types/printer";
import "./DiagnoseModal.css";

interface Props {
  open: boolean;
  result: PrinterDiagnosisResponse | null;
  onClose: () => void;
}

export function DiagnoseModal({ open, result, onClose }: Props) {
  if (!open || !result) return null;

  return (
    <Modal title={`Diagnose — ${result.printer}`} onClose={onClose}>
      <div className="diagnoseModal">
        <pre className="diagnoseModal__details">{result.details}</pre>
      </div>
    </Modal>
  );
}