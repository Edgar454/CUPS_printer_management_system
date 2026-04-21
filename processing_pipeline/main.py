import asyncio
import subprocess
import logging
import sys
import os

from processing_pipeline.utils import get_db_pool


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
# DB functions
# -------------------------------------------------

async def get_next_job(conn):
    return await conn.fetchrow("""
        SELECT *
        FROM print_jobs
        WHERE status = 'QUEUED'
        ORDER BY created_at
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    """)


async def update_status(pool, job_id, status, error=None):
    async with pool.acquire() as conn:
        await conn.execute(
            """
            UPDATE print_jobs
            SET status = $2,
                error_message = $3,
                updated_at = NOW()
            WHERE id = $1
            """,
            job_id,
            status,
            error
        )


# -------------------------------------------------
# Processing layer (simple MVP)
# -------------------------------------------------

async def process_job(pool):
    logger.info("🔄 Worker cycle started")

    cups_server = os.getenv("CUPS_SERVER_URL", "cups_server:631")
    printer_name = os.getenv("CUPS_PRINTER_NAME", "PDF")
    file_folder = os.getenv("FILE_FOLDER" , "/files")

    async with pool.acquire() as conn:

        job = await get_next_job(conn)

        if not job:
            logger.info("📭 No queued jobs found")
            return

        job_id = job["id"]
        file_path = os.path.join(file_folder , job["file_path"])

        logger.info(f"📥 Job picked: {job_id} | file={file_path}")

        await update_status(pool, job_id, "PROCESSING")

        try:
            logger.info(
                f"🖨️ Sending job to CUPS: printer={printer_name} | server={cups_server}"
            )

            # Run lp in a non-blocking way
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

            await update_status(pool, job_id, "COMPLETED")

            logger.info(f"✅ Job completed: {job_id}")

        except Exception as e:
            logger.error(f"❌ Job failed: {job_id} | error={str(e)}")

            await update_status(pool, job_id, "FAILED", str(e))


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