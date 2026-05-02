from pydantic import BaseModel
from typing import Optional

class JobEventQuery(BaseModel):
    limit: int = 100
    offset: int = 0