from fastapi import APIRouter, status, Depends, Request
from api.utils.database import create_job , get_job 
from fastapi.responses import JSONResponse
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def get_db_pool(request: Request):
    return request.app.state.pool

@router.post("/print")
async def print_file(payload: dict, pool= Depends(get_db_pool)):
    return await create_job(
        pool,
        payload["file_path"],
        payload.get("submitted_by", "ui"),
        payload.get("printer_name", 1)
    )

@router.post("/jobs")
async def create_print_job(payload: dict, request: Request , pool= Depends(get_db_pool)):
    result = await create_job(
        pool,
        payload["file_path"],
        payload.get("submitted_by"),
        payload.get("printer_name")
    )

    return  result

@router.get("/jobs/{id}")
async def get_print_job(payload: dict ,pool = Depends(get_db_pool) ):
    result = await get_job(payload["id" , pool])
    return result

