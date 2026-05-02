import asyncio
import subprocess
import logging
import sys
import os

from processing_pipeline.utils import get_db_pool , get_next_job, add_event, is_cancelled


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

    cups_server = os.getenv("CUPS_SERVER_URL", "cups_server:631")
    printer_name = os.getenv("CUPS_PRINTER_NAME", "PDF")
    file_folder = os.getenv("FILE_FOLDER", "/files")

    async with pool.acquire() as conn:
        job = await get_next_job(conn)

        if not job:
            logger.info("📭 No jobs")
            return

        job_id = job["id"]

        # Move to PROCESSING
        await add_event(conn, job_id, "PROCESSING_STARTED")

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
            await add_event(conn, job_id, "PRINTING_STARTED")

        # 🔹 Print (blocking but outside DB)
        proc = await asyncio.to_thread(
            subprocess.run,
            [
                "lp",
                "-h", cups_server,
                "-d", printer_name,
                file_path
            ],
            capture_output=True,
            text=True
        )

        if proc.returncode != 0:
            raise Exception(proc.stderr)

        logger.info(f"🧾 CUPS response: {proc.stdout.strip()}")

        # 🔹 Completed
        async with pool.acquire() as conn:
            await add_event(conn, job_id, "COMPLETED")

        logger.info(f"✅ Job completed: {job_id}")

    except Exception as e:
        logger.error(f"❌ Job failed: {job_id} | {str(e)}")

        async with pool.acquire() as conn:
            await add_event(conn, job_id, "FAILED", error=str(e))

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