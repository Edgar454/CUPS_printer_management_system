from api.models.jobs.job_response import JobSnapshot
from pydantic import BaseModel

class JobListResponse(BaseModel):
    items: list[JobSnapshot]
    total: int