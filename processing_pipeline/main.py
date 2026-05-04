import asyncio
import logging
import sys
import os
import cups
from datetime import datetime, timedelta

from processing_pipeline.utils import (
    get_db_pool , get_next_job, add_event, is_cancelled , get_printer_name , get_cups_conn
)


# -------------------------------------------------
# Logging setup
# -------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/app/logs/pipeline.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("print-worker")


POLL_INTERVAL = 2




# -------------------------------------------------
# Processing layer (simple MVP)
# -------------------------------------------------

async def process_job(pool):
    logger.info("🔄 Worker cycle started")
    file_folder = os.getenv("FILE_FOLDER", "/files")

    async with pool.acquire() as conn:
        worker_id = f"worker-{os.getpid()}"
        job = await get_next_job(conn, worker_id)

        if not job:
            logger.info("📭 No jobs")
            return

        job_id = job["id"]
        filename = job["file_name"]
        retry_count = job["retry_count"]
        printer_id = job["printer_id"]
        printer_name = await get_printer_name(conn, printer_id)

        # Move to PROCESSING
        await add_event(conn, job_id, "PROCESSING_STARTED", printer_id=printer_id)

    # 🔓 connection released here

    file_path = os.path.join(file_folder, job["file_path"])

    try:
        # 🔹 Check cancellation BEFORE doing anything expensive
        async with pool.acquire() as conn:
            if await is_cancelled(conn, job_id):
                logger.info(f"🛑 Job cancelled before processing: {job_id}")
                return

        # 🔹 Move to PRINTING
        async with pool.acquire() as conn:
            await add_event(conn, job_id, "PRINTING_STARTED", printer_id=printer_id)

        # 🔹 Print (blocking but outside DB)
        try:
            cups_conn = get_cups_conn()
            response = cups_conn.printFile(printer_name, file_path, filename, {})
        except cups.IPPError as e:
            raise Exception(str(e))

        logger.info(f"🧾 CUPS response: {response}")

        # 🔹 Completed
        async with pool.acquire() as conn:
            await add_event(conn, job_id, "COMPLETED", printer_id=printer_id)

        logger.info(f"✅ Job completed: {job_id}")

    except Exception as e:
        logger.error(f"❌ Job failed: {job_id} | {str(e)}")

        async with pool.acquire() as conn:
            if retry_count >= 3:
                await add_event(conn, job_id, "FAILED", printer_id=printer_id, error=str(e) )
            else:
                await add_event(conn, job_id, "RETRY", printer_id=printer_id, error=str(e) , locked_until= (datetime.utcnow() + timedelta(minutes=5)) )

# -------------------------------------------------
# Worker loop
# -------------------------------------------------

async def worker_loop():
    logger.info("🚀 Worker started")
    pool = await get_db_pool()
    while True:
        try:
            await process_job(pool)

        except Exception as e:
            logger.error(f"💥 Unexpected worker error: {str(e)}")

        await asyncio.sleep(POLL_INTERVAL)


# -------------------------------------------------
# Entrypoint
# -------------------------------------------------

if __name__ == "__main__":
    asyncio.run(worker_loop())