import { useState } from "react";
import { Modal } from "@/components/modal/Modal";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/btn/Button";
import type { Printer } from "@/types/printer";
import "./AddPrinterModal.css";

interface Props {
  //TODO: we can make this more flexible by allowing partial printer data and letting the backend fill in the rest
  open: boolean;
  onClose: () => void;
  onSubmit: (printer: Printer) => void;
}

export function AddPrinterModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: "",
    ip: "",
    uri: "",
  });

  if (!open) return null;

  const handleSubmit = () => {
    const newPrinter: Printer = {
      id: Date.now(),
      name: form.name || "New Printer",
      ip: form.ip || "0.0.0.0",
      status: "ONLINE",
      queue: 0,
      lastActivity: "Just added",
    };

    onSubmit(newPrinter);
    onClose();

    // reset form
    setForm({ name: "", ip: "", uri: "" });
  };

  return (
    <Modal title="Add Printer" onClose={onClose}>
      <div className="addPrinterModal">
        <Input
          label="Printer Name"
          placeholder="HP LaserJet 500"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          label="IP Address"
          placeholder="192.168.1.110"
          value={form.ip}
          onChange={(e) =>
            setForm({ ...form, ip: e.target.value })
          }
        />

        <Input
          label="CUPS URI"
          placeholder="ipp://cups_server:631/printers/..."
          value={form.uri}
          onChange={(e) =>
            setForm({ ...form, uri: e.target.value })
          }
        />

        <div className="addPrinterModal__actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit}>
            Add Printer
          </Button>
        </div>
      </div>
    </Modal>
  );
}