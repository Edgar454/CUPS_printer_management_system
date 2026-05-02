from pydantic import BaseModel

class SystemStats(BaseModel):
    total: int
    completed: int
    failed: int
    processing: int