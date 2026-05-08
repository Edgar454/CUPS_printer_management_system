import { Modal } from "@/components/modal/Modal";
import { Badge } from "@/components/badge/Badge";
import type { PrinterTestResponse } from "@/types/printer";
import "./TestResultModal.css";

interface Props {
  open: boolean;
  result: PrinterTestResponse | null;
  onClose: () => void;
}

export function TestResultModal({ open, result, onClose }: Props) {
  if (!open || !result) return null;

  return (
    <Modal title={`Test — ${result.printer}`} onClose={onClose}>
      <div className="testResultModal">
        <div className="testResultModal__status">
          <span>Status:</span>
          <Badge status={result.status} />
        </div>
        <pre className="testResultModal__output">{result.output}</pre>
      </div>
    </Modal>
  );
}