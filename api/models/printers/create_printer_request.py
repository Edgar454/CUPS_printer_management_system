from pydantic import BaseModel

class CreatePrinterRequest(BaseModel):
    name: str
    cups_uri: str