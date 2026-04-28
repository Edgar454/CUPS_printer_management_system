import "./SchedulePrintModal.css";
import { Modal } from "@/components/modal/Modal";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/btn/Button";
import type { Printer } from "@/types/printer";

interface Props {
  open: boolean;
  fileName: string | null;
  printers: Printer[];
  onClose: () => void;
  onConfirm: (data: {
    fileName: string;
    printer: string;
    date: string;
    time: string;
    priority: string;
  }) => void;
}

export function SchedulePrintModal({
  open,
  fileName,
  printers,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  const onlinePrinters = printers.filter((p) => p.status === "ONLINE");

  const handleSubmit = () => {
    // simple DOM-based extraction kept minimal for now
    const form = document.getElementById("schedule-form") as HTMLFormElement;

    const formData = new FormData(form);

    onConfirm({
      fileName: fileName || "",
      printer: String(formData.get("printer") || ""),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || ""),
      priority: String(formData.get("priority") || "Normal"),
    });

    onClose();
  };

  return (
    <Modal title="Schedule Print" onClose={onClose}>
      <div className="scheduleModal">
        <div className="scheduleModal__file">
          File: <strong>{fileName}</strong>
        </div>

        <form id="schedule-form" className="scheduleModal__form">
          <div className="scheduleModal__field">
            <label>Printer</label>
            <select name="printer">
              {onlinePrinters.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="scheduleModal__grid">
            <Input name="date" label="Date" type="date" />
            <Input name="time" label="Time" type="time" />
          </div>

          <div className="scheduleModal__field">
            <label>Priority</label>
            <select name="priority" defaultValue="Normal">
              <option>Normal</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </div>

          <div className="scheduleModal__actions">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>

            <Button type="button" onClick={handleSubmit}>
              Confirm Schedule
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}