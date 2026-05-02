from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel

class JobEvent(BaseModel):
    id: int
    job_id: UUID
    event_type: str
    printer_id: Optional[int] = None
    message: Optional[str] = None
    error: Optional[str] = None
    source: str
    created_at: datetime