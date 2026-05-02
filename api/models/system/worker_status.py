from pydantic import BaseModel
from datetime import datetime , timedelta

class WorkerStatus(BaseModel):
    worker_id: str
    last_seen: datetime
    lag: timedelta