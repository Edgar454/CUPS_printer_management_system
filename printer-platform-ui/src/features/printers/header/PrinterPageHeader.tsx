import { Button } from "@/components/btn/Button";
import "./PrinterPageHeader.css";

interface Props {
  //TODO: onTestAll is optional for now, but we may want to make it required in the future when we have the functionality implemented.
  onAdd: () => void;
  onTestAll?: () => void;
}

export function PrinterPageHeader({ onAdd, onTestAll }: Props) {
  return (
    <div className="printerHeader">
      <h2 className="printerHeader__title">
        Printer Management
      </h2>

      <div className="printerHeader__actions">
        <Button variant="secondary" onClick={onTestAll}>
          Test All
        </Button>

        <Button onClick={onAdd}>
          + Add Printer
        </Button>
      </div>
    </div>
  );
}