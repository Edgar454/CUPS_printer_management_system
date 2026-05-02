from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

class CreateJobResponse(BaseModel):
    job_id: UUID
    status: Literal["QUEUED", "SCHEDULED"]
    created_at: datetime