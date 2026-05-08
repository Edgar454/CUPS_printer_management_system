from typing import Literal , Optional
from pydantic import BaseModel

class Printer(BaseModel):
    id: int
    name: str
    status: Literal["ONLINE", "OFFLINE", "ERROR"]
    cups_uri: str
    queue_count: Optional[int] = None