import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/btn/Button";
import type { Printer } from "@/types/printer";
import "./PrinterCard.css";

interface Props {
  //TODO: Implement printer diagnostics and testing features, then make these callbacks required instead of optional
  printer: Printer;
  onTest?: (id: number) => void;
  onEdit?: (id: number) => void;
  onRemove?: (id: number) => void;
  onDiagnose?: (id: number) => void;
}

export function PrinterCard({
  printer,
  onTest,
  onEdit,
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
          <span className="printerCard__mono">{printer.ip}</span>
        </div>

        <div>Last activity: {printer.lastActivity}</div>

        {printer.queue > 0 && (
          <div>Queue: {printer.queue} job(s)</div>
        )}
      </div>

      {/* actions */}
      <div className="printerCard__actions">
        <Button small variant="secondary" onClick={() => onTest?.(printer.id)}>
          Test Print
        </Button>

        <Button small variant="secondary" onClick={() => onEdit?.(printer.id)}>
          Edit
        </Button>

        {printer.status === "OFFLINE" && (
          <Button small variant="secondary" onClick={() => onDiagnose?.(printer.id)}>
            Diagnose
          </Button>
        )}

        <Button small variant="danger" onClick={() => onRemove?.(printer.id)}>
          Remove
        </Button>
      </div>
    </div>
  );
}