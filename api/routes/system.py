from fastapi import APIRouter, status, Depends, Request , HTTPException
from fastapi.responses import JSONResponse

from api.utils.queries import ( 
    GET_WORKER_STATUS_QUERY, SYSTEM_STATS_QUERY , QUEUE_METRICS_QUERY
)
from api.models.system.worker_status import WorkerStatus
from api.models.system.system_stats_response import SystemStats
from api.utils.route_utils import get_db_pool , get_settings

import subprocess
import logging

router = APIRouter(prefix="/system", tags=["system"])
logger = logging.getLogger(__name__)


@router.get("/health")
async def health_check(pool=Depends(get_db_pool), settings=Depends(get_settings)):
    try:
        checks = {
            "database": False,
            "cups": False
        }

        # DB check
        try:
            logger.info("Checking database connection...")
            async with pool.acquire() as conn:
                await conn.execute("SELECT 1;")
            checks["database"] = True
            logger.info("Database connection successful")
        except Exception as e:
            logger.exception("Database connection failed")
            pass

        # CUPS check
        try:
            logger.info("Checking CUPS server health...")
            result = subprocess.run(
                ["lpstat", "-h", settings.CUPS_SERVER_URL, "-r"],
                capture_output=True,
                text=True
            )
            checks["cups"] = "scheduler is running" in result.stdout.lower()
            logger.info(f"CUPS server is {'healthy' if checks['cups'] else 'unhealthy'}")
        except Exception as e:
            logger.exception("CUPS server health check failed")
            pass

        status = "ok" if all(checks.values()) else "degraded"

        return {
            "status": status,
            "checks": checks
        }

    except Exception as e:
        logger.exception("Health check failed")
        raise HTTPException(status_code=503, detail="System unhealthy")

@router.get("/workers" , response_model=list[WorkerStatus])
async def worker_status(pool=Depends(get_db_pool)):
    try:
        rows = await pool.fetch(GET_WORKER_STATUS_QUERY)
        return [WorkerStatus(**dict(r)) for r in rows]
    except Exception:
        logger.exception("Worker status failed")
        raise HTTPException(status_code=500, detail="Error fetching worker status")

@router.get("/stats", response_model=SystemStats)
async def system_stats(pool=Depends(get_db_pool)):
    try:
        row = await pool.fetchrow(SYSTEM_STATS_QUERY)

        return SystemStats(**dict(row))

    except Exception:
        logger.exception("Stats failed")
        raise HTTPException(status_code=500, detail="Error fetching stats")

@router.get("/queue")
async def queue_metrics(pool=Depends(get_db_pool)):
    try:
        row = await pool.fetchrow(QUEUE_METRICS_QUERY)

        return {
            "queued": row["queued"],
            "ready_to_queue": row["ready_to_queue"]
        }

    except Exception:
        logger.exception("Queue metrics failed")
        raise HTTPException(status_code=500, detail="Error fetching queue metrics")