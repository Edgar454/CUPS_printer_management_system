import asyncio
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

from api.utils.route_utils import get_db_pool , get_settings  , get_cups_conn
from api.utils.lifespan_utils import create_cups_connection

import logging
from opentelemetry import trace


router = APIRouter(prefix="/printers", tags=["printers"])
logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)


@router.get("/", response_model=list[Printer])
async def get_printers(pool=Depends(get_db_pool)):
    try:
        rows = await pool.fetch(GET_ALL_PRINTERS_QUERY)
        return [Printer(**dict(r)) for r in rows]
    except Exception:
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
            printer = await conn.fetchrow(ADD_PRINTER_QUERY, payload.name, payload.cups_uri, "OFFLINE")
        except Exception:
            raise HTTPException(400, "Printer already exists")

    
        def _add_printer(payload):
            with tracer.start_as_current_span("cups.add_printer") as span:
                span.set_attribute("printer.name", payload.name)
                span.set_attribute("printer.uri", payload.cups_uri)
                
                logger.info(f"Adding printer {payload.name} to CUPS with URI {payload.cups_uri}")
                cups_conn = create_cups_connection()
                cups_conn.addPrinter(name=payload.name, device=payload.cups_uri)
                cups_conn.enablePrinter(payload.name)
                cups_conn.acceptJobs(payload.name)
                logger.info(f"Printer {payload.name} added to CUPS successfully")
                return "ONLINE"

    try:
        status = await asyncio.wait_for(
            asyncio.to_thread(_add_printer, payload),
            timeout=10
        )
    except asyncio.TimeoutError:
        logger.error("CUPS addPrinter timed out")
        status = "ERROR"


    except Exception as e:
        logger.exception("CUPS addPrinter failed")
        status = "ERROR"

    async with pool.acquire() as conn:
        await conn.execute(UPDATE_PRINTER_STATUS_QUERY, status, payload.name)

    return {**dict(printer), "status": status}


@router.post("/printers/{name}/test", response_model=PrinterTestResponse)
async def test_printer(name: str, pool=Depends(get_db_pool), settings=Depends(get_settings), cups_conn=Depends(get_cups_conn)):
    try:
        async with pool.acquire() as conn:
            printer = await conn.fetchrow(GET_PRINTER_QUERY, name)

            if not printer:
                raise HTTPException(status_code=404, detail="Printer not found")

            name = printer["name"]

            try:
                attrs = cups_conn.getPrinterAttributes(name)
                status = "ONLINE"
                output = str(attrs)
            except Exception as e:
                status = "ERROR"
                output = str(e)

            await conn.execute(UPDATE_PRINTER_STATUS_QUERY, status, name)

            return {
                "printer": name,
                "status": status,
                "output": output
            }

    except Exception:
        logger.exception("Printer test failed")
        raise HTTPException(status_code=500, detail="Printer test failed")


@router.get("/printers/{name}/diagnose", response_model=PrinterDiagnosisResponse)
async def diagnose_printer(name: str, pool=Depends(get_db_pool), settings=Depends(get_settings) , cups_conn=Depends(get_cups_conn)):
    try:
        async with pool.acquire() as conn:
            printer = await conn.fetchrow(GET_PRINTER_QUERY, name)

            if not printer:
                raise HTTPException(status_code=404, detail="Printer not found")

            name = printer["name"]

            attrs = cups_conn.getPrinterAttributes(name)

            return {
                "printer": name,
                "details": str(attrs)
            }

    except Exception:
        logger.exception("Diagnose failed")
        raise HTTPException(status_code=500, detail="Diagnose failed")


@router.delete("/{name}")
async def delete_printer(name: str, pool=Depends(get_db_pool), settings=Depends(get_settings) ):
    async with pool.acquire() as conn:
        printer = await conn.fetchrow(GET_PRINTER_QUERY, name)

        if not printer:
            raise HTTPException(404, "Printer not found")

    printer_name = printer["name"]

    try:
        logger.info(f"Deleting printer {printer_name} from CUPS")
        def _delete_printer(printer_name):
            with tracer.start_as_current_span("cups.delete_printer") as span:
                span.set_attribute("printer.name", printer_name)
                cups_conn = create_cups_connection()
                cups_conn.deletePrinter(printer_name)
        await asyncio.to_thread(_delete_printer, printer_name)
        logger.info(f"Printer {printer_name} deleted from CUPS successfully")
    except Exception as e:
        span.set_status(trace.StatusCode.ERROR, str(e))
        span.record_exception(e)
        raise HTTPException(
            500,
            f"Failed to delete printer from CUPS: {e}"
        )

    async with pool.acquire() as conn:
        await conn.execute(DELETE_PRINTER_QUERY, name)

    return {"message": "Printer deleted successfully"}