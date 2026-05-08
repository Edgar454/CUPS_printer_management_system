import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/btn/Button";
import type { Printer } from "@/types/printer";
import "./PrinterCard.css";

interface Props {
  //TODO: Implement printer diagnostics and testing features, then make these callbacks required instead of optional
  printer: Printer;
  onTest?: (name: string) => void;
  onRemove?: (name: string) => void;
  onDiagnose?: (name: string) => void;
}

export function PrinterCard({
  printer,
  onTest,
  onRemove,
  onDiagnose,
}: Props) {
  return (
    <div className="printerCard">
      {/* header */}
      <div className="printerCard__header">
        <span className="printerCard__icon">🖨️</span>

        <div className="printerCard__info">
          <div className="printerCard__name">{printer.name}</div>
        </div>

        <Badge status={printer.status} />
      </div>

      {/* details */}
      <div className="printerCard__details">
        <div>
          IP:{" "}
          <span className="printerCard__mono">{printer.cups_uri}</span>
        </div>

        {printer.queue_count > 0 && (
          <div>Queue: {printer.queue_count} job(s)</div>
        )}
      </div>

      {/* actions */}
      <div className="printerCard__actions">
        <Button small variant="secondary" onClick={() => onTest?.(printer.name)}>
          Test 
        </Button>

        {printer.status === "OFFLINE" || printer.status === "ERROR" ? (
          <Button small variant="secondary" onClick={() => onDiagnose?.(printer.name)}>
            Diagnose
          </Button>
        ): null}

        <Button small variant="danger" onClick={() => onRemove?.(printer.name)}>
          Remove
        </Button>
      </div>
    </div>
  );
}