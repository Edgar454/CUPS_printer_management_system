import uuid
import shutil
from pathlib import Path
import os

from fastapi import APIRouter, status, Depends, Request , HTTPException
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse , FileResponse

import logging

from api.utils.route_utils import  get_settings

router = APIRouter(prefix="/files", tags=["files"])
logger = logging.getLogger(__name__)



@router.get("/", response_model=list[str])
async def list_files(limit: int = 100, offset: int = 0, settings=Depends(get_settings)):
    try:
        files = [
            f for f in os.listdir(settings.FILE_FOLDER)
            if f.endswith(".pdf")
        ]
        return files[offset:offset+limit]
    except Exception as e:
        logger.exception("Error listing files")
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/upload")
async def upload_file(file: UploadFile = File(...), settings=Depends(get_settings)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF allowed")

    original_name = Path(file.filename).name  
    file_path = Path(settings.FILE_FOLDER) / original_name

    # avoid overwrite
    if file_path.exists():
        raise HTTPException(status_code=409, detail="File already exists")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        logger.exception("Upload failed")
        raise HTTPException(status_code=500, detail="Upload failed")

    return {
        "original_name": original_name,
        "file_path": str(file_path)
    }



@router.get("/{filename}")
async def download_file(filename: str, settings=Depends(get_settings)):
    file_path = Path(settings.FILE_FOLDER) / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # prevent path traversal
    if not file_path.resolve().is_relative_to(Path(settings.FILE_FOLDER).resolve()):
        raise HTTPException(status_code=400, detail="Invalid path")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        status_code=200,
        headers={
                "Content-Disposition": f'inline; filename="{filename}"'
            }
    )
