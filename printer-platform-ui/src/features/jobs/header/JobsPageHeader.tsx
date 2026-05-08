import "./JobsPageHeader.css";
import { useRef } from "react";
import { Button } from "@/components/btn/Button";
import { uploadFile } from "@/services/files";

interface Props {
  onRefresh?: () => void;
  onUploadSuccess?: () => void;
}

export function JobsPageHeader({ onRefresh, onUploadSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file);
      onUploadSuccess?.();
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("File already exists");
      } else {
        alert("Upload failed");
      }
    } finally {
      // reset input so same file can be uploaded again after deletion
      e.target.value = "";
    }
  };

  return (
    <div className="jobsPageHeader">
      <h2 className="jobsPageHeader__title">Files & Jobs</h2>

      <div className="jobsPageHeader__actions">
        <Button variant="secondary" onClick={onRefresh} type="button">
          Refresh
        </Button>

        <Button onClick={() => fileInputRef.current?.click()} type="button">
          ⬆ Upload File
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}