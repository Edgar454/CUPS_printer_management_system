from uuid import UUID
from fastapi import APIRouter, status, Depends, Request , HTTPException
from fastapi.responses import JSONResponse
from api.utils.queries import (
    GET_JOBS_QUERY , GET_JOB_QUERY , GET_JOB_EVENTS_QUERY , CHECK_JOB_EXISTENCE , CREATE_JOB_QUERY,
    CANCEL_JOB_QUERY , RETRY_JOB_QUERY
)

from api.models.jobs.job_event import JobEvent
from api.models.jobs.job_list_request import JobFilter
from api.models.jobs.job_response import JobSnapshot
from api.models.jobs.job_list_response import JobListResponse
from api.models.jobs.create_job_request import CreateJobRequest
from api.models.jobs.cancel_job_request import CancelJobRequest
from api.models.jobs.retry_job_request import RetryJobRequest


import logging

router = APIRouter(prefix="/jobs", tags=["jobs"])
logger = logging.getLogger(__name__)

def get_db_pool(request: Request):
    return request.app.state.pool

@router.get("/", response_model=JobListResponse)
async def get_jobs(
    filter: JobFilter = Depends(),
    pool=Depends(get_db_pool)
):
    try:
        result = await pool.fetch(
            GET_JOBS_QUERY,
            filter.status,
            filter.printer_id,
            filter.submitted_by,
            filter.limit,
            filter.offset
        )

        if not result:
            return {"items": [], "total": 0}

        total = result[0]["total"]
        jobs = [dict(r) for r in result]

        # remove duplicated total field from items
        for j in jobs:
            j.pop("total", None)

        return {
            "items": jobs,
            "total": total
        }

    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        raise HTTPException(status_code=500, detail="Error fetching jobs")

@router.get("/{id}", response_model=JobSnapshot)
async def get_job_by_id(id: UUID, pool=Depends(get_db_pool)):
    try:
        result = await pool.fetch(GET_JOB_QUERY, id)

        if not result:
            raise HTTPException(status_code=404, detail="Job not found")

        return JobSnapshot(**dict(result[0]))

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error fetching job")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.get("/{id}/events", response_model=list[JobEvent])
async def get_job_events(
    id: UUID,
    limit: int = 100,
    offset: int = 0,
    pool=Depends(get_db_pool)
):
    try:
        job_exists = await pool.fetchval(
            CHECK_JOB_EXISTENCE,
            id
        )

        if not job_exists:
            raise HTTPException(status_code=404, detail="Job not found")

        result = await pool.fetch(
            GET_JOB_EVENTS_QUERY,
            id,
            limit,
            offset
        )

        return [JobEvent(**dict(r)) for r in result]

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error fetching job events")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/", response_model=JobSnapshot)
async def create_print_job(
    payload: CreateJobRequest,
    pool=Depends(get_db_pool)
):
    try:
        async with pool.acquire() as conn:
            async with conn.transaction():

                job_id = await conn.fetchval(
                    CREATE_JOB_QUERY,
                    payload.client_request_id,
                    payload.file_name,
                    payload.file_path,
                    payload.printer_id,
                    payload.scheduled_at,
                )

                job = await conn.fetchrow(
                    GET_JOB_QUERY,
                    job_id
                )

                return JobSnapshot(**dict(job))

    except Exception:
        logger.exception("Error creating job")
        raise HTTPException(status_code=500, detail="Internal server error")




@router.post("/{id}/cancel", response_model=JobSnapshot)
async def cancel_job(
    id: UUID,
    client_request_id: str,
    pool=Depends(get_db_pool)
):
    try:
        async with pool.acquire() as conn:
            async with conn.transaction():

                # ensure job exists
                exists = await conn.fetchval(
                    CHECK_JOB_EXISTENCE,
                    id
                )
                if not exists:
                    raise HTTPException(status_code=404, detail="Job not found")

                await conn.execute(
                    CANCEL_JOB_QUERY,
                    id,
                    client_request_id
                )

                job = await conn.fetchrow(GET_JOB_QUERY, id)

                return JobSnapshot(**dict(job))

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error cancelling job")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/{id}/retry", response_model=JobSnapshot)
async def retry_job(
    id: UUID,
    client_request_id: str,
    pool=Depends(get_db_pool)
):
    try:
        async with pool.acquire() as conn:
            async with conn.transaction():

                # ensure job exists
                exists = await conn.fetchval(
                    CHECK_JOB_EXISTENCE,
                    id
                )
                if not exists:
                    raise HTTPException(status_code=404, detail="Job not found")

                await conn.execute(
                    RETRY_JOB_QUERY,
                    id,
                    client_request_id
                )

                job = await conn.fetchrow(GET_JOB_QUERY, id)

                return JobSnapshot(**dict(job))

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error retrying job")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/{id}/retry", response_model=JobSnapshot)
async def retry_job(
    id: UUID,
    payload: RetryJobRequest,
    pool=Depends(get_db_pool)
):
    try:
        async with pool.acquire() as conn:
            async with conn.transaction():

                # 1. Lock job (prevent race with worker)
                job = await conn.fetchrow(
                    "SELECT * FROM print_jobs WHERE id = $1 FOR UPDATE",
                    id
                )

                if not job:
                    raise HTTPException(status_code=404, detail="Job not found")

                # 2. Only FAILED jobs can be retried
                if job["status"] != "FAILED":
                    raise HTTPException(
                        status_code=400,
                        detail=f"Cannot retry job in status {job['status']}"
                    )

                # 3. Add retry event
                await conn.execute(
                    RETRY_JOB_QUERY,
                    id,
                    job["printer_id"],
                    payload.message or "Retry requested via API",
                    payload.client_request_id
                )

                # 4. Return updated snapshot
                updated = await conn.fetchrow(
                    GET_JOB_QUERY,
                    id
                )

                return dict(updated)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error retrying job")
        raise HTTPException(status_code=500, detail="Internal server error")