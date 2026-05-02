from typing import Literal
from pydantic import BaseModel

class Printer(BaseModel):
    id: int
    name: str
    status: Literal["ONLINE", "OFFLINE", "ERROR"]
    cups_uri: str