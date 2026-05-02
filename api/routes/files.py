import uuid
import shutil
import os

from fastapi import APIRouter, status, Depends, Request , HTTPException
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse

import logging

router = APIRouter(prefix="/files", tags=["files"])
logger = logging.getLogger(__name__)

FILES_BASE_PATH = os.getenv("FILES_BASE_PATH", "/tmp/cups_files")

@router.get("/", response_model=list[str])
async def list_files(limit: int = 100, offset: int = 0):
    try:
        files = [
            f for f in os.listdir(FILES_BASE_PATH)
            if f.endswith(".pdf")
        ]
        return files[offset:offset+limit]
    except Exception as e:
        logger.exception("Error listing files")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF allowed")

        file_id = str(uuid.uuid4())
        filename = f"{file_id}.pdf"
        file_path = os.path.join(FILES_BASE_PATH, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "file_name": filename,
            "file_path": file_path
        }

    except Exception as e:
        logger.exception("Upload failed")
        raise HTTPException(status_code=500, detail=str(e))