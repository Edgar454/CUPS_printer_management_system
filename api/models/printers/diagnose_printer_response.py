from pydantic import BaseModel

class PrinterDiagnosisResponse(BaseModel):
    printer: str
    details: str