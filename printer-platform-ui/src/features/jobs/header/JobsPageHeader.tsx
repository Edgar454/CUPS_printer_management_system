import "./JobsPageHeader.css";
import { Button } from "@/components/btn/Button";

interface Props {
  onRefresh?: () => void;
  onUpload?: () => void;
}

export function JobsPageHeader({ onRefresh, onUpload }: Props) {
  return (
    <div className="jobsPageHeader">
      <h2 className="jobsPageHeader__title">Files & Jobs</h2>

      <div className="jobsPageHeader__actions">
        <Button variant="secondary" onClick={onRefresh}>
          Refresh
        </Button>

        <Button onClick={onUpload}>
          ⬆ Upload File
        </Button>
      </div>
    </div>
  );
}