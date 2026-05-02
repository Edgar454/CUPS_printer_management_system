from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CreateJobRequest(BaseModel):
    file_name: str
    file_path: str
    printer_id: Optional[int] = None
    submitted_by: Optional[str] = None

    client_request_id: str
    scheduled_at: Optional[datetime] = None


