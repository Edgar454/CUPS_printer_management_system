from uuid import UUID
from fastapi import APIRouter, status, Depends, Request , HTTPException
from fastapi.responses import JSONResponse
from api.utils.queries import (
    GET_ALL_PRINTERS_QUERY , GET_PRINTER_QUERY , ADD_PRINTER_QUERY , DELETE_PRINTER_QUERY, UPDATE_PRINTER_STATUS_QUERY
)

from api.models.printers.printer import Printer
from api.models.printers.create_printer_request import CreatePrinterRequest
from api.models.printers.printer_test_response import PrinterTestResponse
from api.models.printers.diagnose_printer_response import PrinterDiagnosisResponse

import subprocess
import logging

router = APIRouter(prefix="/printers", tags=["printers"])
logger = logging.getLogger(__name__)

def get_db_pool(request: Request):
    return request.app.state.pool


@router.get("/", response_model=list[Printer])
async def get_printers(pool=Depends(get_db_pool)):
    try:
        rows = await pool.fetch(GET_ALL_PRINTERS_QUERY)
        return [Printer(**dict(r)) for r in rows]
    except Exception as e:
        logger.exception("Error fetching printers")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{name}", response_model=Printer)
async def get_printer(name: str, pool=Depends(get_db_pool)):
    row = await pool.fetchrow(GET_PRINTER_QUERY, name)

    if not row:
        raise HTTPException(404, "Printer not found")

    return Printer(**dict(row))

@router.post("/", response_model=Printer)
async def create_printer(payload: CreatePrinterRequest, pool=Depends(get_db_pool)):
    async with pool.acquire() as conn:
        try:
            # 1. Insert as CREATING
            printer = await conn.fetchrow(ADD_PRINTER_QUERY, payload.name, payload.cups_uri, "OFFLINE")

        except Exception:
            raise HTTPException(400, "Printer already exists")

    # 2. Try to create in CUPS (outside transaction)
    try:
        subprocess.run([
            "lpadmin",
            "-p", payload.name,
            "-E",
            "-v", payload.cups_uri,
            "-m", "everywhere"
        ], check=True)

        # 3. Validate printer
        subprocess.run(["lpstat", "-p", payload.name], check=True)

        status = "ONLINE"

    except subprocess.CalledProcessError:
        status = "ERROR"

    # 4. Update DB
    async with pool.acquire() as conn:
        await conn.execute(UPDATE_PRINTER_STATUS_QUERY, status, payload.name)

    return {**dict(printer), "status": status}



@router.post("/printers/{name}/test" , response_model=PrinterTestResponse)
async def test_printer(name: str, pool=Depends(get_db_pool)):
    try:
        async with pool.acquire() as conn:
            printer = await conn.fetchrow(
                GET_PRINTER_QUERY,
                name
            )

            if not printer:
                raise HTTPException(status_code=404, detail="Printer not found")

            name = printer["name"]

            result = subprocess.run(
                ["lpstat", "-p", name],
                capture_output=True,
                text=True
            )

            status = "ONLINE" if result.returncode == 0 else "ERROR"

            await conn.execute(
                UPDATE_PRINTER_STATUS_QUERY,
                status, name
            )

            return {
                "printer": name,
                "status": status,
                "output": result.stdout or result.stderr
            }

    except Exception:
        logger.exception("Printer test failed")
        raise HTTPException(status_code=500, detail="Printer test failed")

@router.get("/printers/{name}/diagnose", response_model=PrinterDiagnosisResponse)
async def diagnose_printer(name: str, pool=Depends(get_db_pool)):
    try:
        async with pool.acquire() as conn:
            printer = await conn.fetchrow(
                GET_PRINTER_QUERY,
                name
            )

            if not printer:
                raise HTTPException(status_code=404, detail="Printer not found")

            name = printer["name"]

            result = subprocess.run(
                ["lpstat", "-l", "-p", name],
                capture_output=True,
                text=True
            )

            return {
                "printer": name,
                "details": result.stdout or result.stderr
            }

    except Exception:
        logger.exception("Diagnose failed")
        raise HTTPException(status_code=500, detail="Diagnose failed")

@router.delete("/{name}")
async def delete_printer(name: str, pool=Depends(get_db_pool)):
    async with pool.acquire() as conn:
        printer = await conn.fetchrow(
            GET_PRINTER_QUERY,
            name
        )

        if not printer:
            raise HTTPException(404, "Printer not found")

    printer_name = printer["name"]

    # 1. Try removing from CUPS
    try:
        subprocess.run(
            ["lpadmin", "-x", printer_name],
            check=True
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            500,
            f"Failed to delete printer from CUPS: {e}"
        )

    # 2. Delete from DB
    async with pool.acquire() as conn:
        await conn.execute(DELETE_PRINTER_QUERY, name)

    return {"message": "Printer deleted successfully"}