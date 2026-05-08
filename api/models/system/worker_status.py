from pydantic import BaseModel
from datetime import datetime

class WorkerStatus(BaseModel):
    worker_id: str
    last_seen: datetime
    lag: float  