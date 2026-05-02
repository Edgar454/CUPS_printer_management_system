from pydantic import BaseModel

class CancelJobRequest(BaseModel):
    client_request_id: str