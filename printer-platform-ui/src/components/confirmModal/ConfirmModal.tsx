import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/btn/Button";
import "./ConfirmModal.css";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({ open, title, message, onConfirm, onClose }: Props) {
  if (!open) return null;

  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirmModal">
        <p className="confirmModal__message">{message}</p>
        <div className="confirmModal__actions">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} type="button">
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}