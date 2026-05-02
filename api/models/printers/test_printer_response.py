from pydantic import BaseModel

class PrinterTestResponse(BaseModel):
    printer: str
    status: str
    output: str