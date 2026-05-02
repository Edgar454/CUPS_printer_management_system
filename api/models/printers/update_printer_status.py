from typing import Literal
from pydantic import BaseModel

class UpdatePrinterStatus(BaseModel):
    status: Literal["ONLINE", "OFFLINE", "ERROR"]