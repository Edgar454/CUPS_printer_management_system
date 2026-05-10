from pydantic import BaseModel

class QueueStats(BaseModel):
    queued: int
    scheduled: int