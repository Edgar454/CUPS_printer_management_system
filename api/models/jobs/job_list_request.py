from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class JobFilter(BaseModel):
    status: Optional[str] = None
    printer_id: Optional[int] = None
    submitted_by: Optional[str] = None
    limit: int = 50
    offset: int = 0