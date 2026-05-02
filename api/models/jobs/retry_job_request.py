from pydantic import BaseModel
from typing import Optional

class RetryJobRequest(BaseModel):
    client_request_id: str
    message: Optional[str] = None