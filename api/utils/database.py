import asyncpg
import uuid
from api.utils.queries import CREATE_JOB_QUERY, GET_JOB_QUERY, GET_PRINTER_QUERY
import logging

logger = logging.getLogger(__name__)


async def create_job(pool: asyncpg.Pool, file_path: str, submitted_by: str, printer_name: str):
    job_id = uuid.uuid4()
    file_name = file_path.split("/")[-1]

    async with pool.acquire() as conn:

        # 🔍 resolve printer
        printer = await conn.fetchrow(GET_PRINTER_QUERY, printer_name)

        if not printer:
            logger.error(f"❌ Printer '{printer_name}' not found in system")
            raise ValueError(f"Printer '{printer_name}' does not exist")

        printer_id = printer["id"]

        # 🧾 insert job
        await conn.execute(
            CREATE_JOB_QUERY,
            job_id,
            file_name,
            file_path,
            printer_id,
            submitted_by
        )

    logger.info(f"📥 Job created: {job_id} → printer={printer_name}")

    return {
        "job_id": str(job_id),
        "status": "QUEUED"
    }


async def get_job(pool, job_id):
    async with pool.acquire() as conn:
        row = await conn.fetchrow(GET_JOB_QUERY, job_id)

    return dict(row) if row else None