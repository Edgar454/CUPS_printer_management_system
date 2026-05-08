import { useState } from "react";
import { Modal } from "@/components/modal/Modal";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/btn/Button";
import type { CreatePrinterPayload } from "@/types/printer";
import "./AddPrinterModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePrinterPayload) => Promise<void>;
}

export function AddPrinterModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({ name: "", cups_uri: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.name || !form.cups_uri) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({ name: form.name, cups_uri: form.cups_uri });
      setForm({ name: "", cups_uri: "" });
    } catch (e) {
      setError("Failed to add printer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add Printer" onClose={onClose}>
      <div className="addPrinterModal">
        <Input
          label="Printer Name"
          placeholder="HP LaserJet 500"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="CUPS URI"
          placeholder="ipp://dummy_printer:8631/ipp/print"
          value={form.cups_uri}
          onChange={(e) => setForm({ ...form, cups_uri: e.target.value })}
        />

        {error && <div className="addPrinterModal__error">{error}</div>}

        <div className="addPrinterModal__actions">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="button">
            {loading ? "Adding..." : "Add Printer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}