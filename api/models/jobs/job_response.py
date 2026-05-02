from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

class JobSnapshot(BaseModel):
    id: UUID
    printer_id: Optional[int] = None
    file_name: str
    file_path: str
    status: str
    scheduled_at: Optional[datetime] = None
    retry_count: int
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime