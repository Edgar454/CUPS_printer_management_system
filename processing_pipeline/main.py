import asyncio
import logging
import sys
import os
import cups
import json
from datetime import datetime, timedelta
from opentelemetry import trace , propagate 

from processing_pipeline.tracing import setup_tracing, continue_trace
from processing_pipeline.utils import (
    get_db_pool , create_listening_pool , get_next_job, add_event, is_cancelled , get_printer_name , get_cups_conn
)

setup_tracing()

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

logger = logging.getLogger(__name__)
tracer = trace.get_tracer(__name__)


POLL_INTERVAL = 30

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
        trace_context = job["trace_context"]
        printer_name = await get_printer_name(conn, printer_id)

        # Move to PROCESSING
        await add_event(conn, job_id, "PROCESSING_STARTED", printer_id=printer_id)

    # 🔓 connection released here
    # continue the trace from API
    ctx = continue_trace(trace_context)

    with tracer.start_as_current_span(
        "pipeline.process_job",
        context=ctx,
        kind=trace.SpanKind.CONSUMER
    ) as span:
        span.set_attribute("job.id", str(job_id))
        span.set_attribute("job.file", filename)
        span.set_attribute("job.retry_count", retry_count)
        span.set_attribute("printer.name", printer_name)

        file_path = os.path.join(file_folder, job["file_path"])

        try:
            # 🔹 Check cancellation BEFORE doing anything expensive
            async with pool.acquire() as conn:
                if await is_cancelled(conn, job_id):
                    span.set_attribute("job.cancelled", True)
                    logger.info(f"🛑 Job cancelled before processing: {job_id}")
                    return

            # 🔹 Move to PRINTING
            async with pool.acquire() as conn:
                await add_event(conn, job_id, "PRINTING_STARTED", printer_id=printer_id)

            # 🔹 Print 
            with tracer.start_as_current_span("cups.print_file") as print_span:
                print_span.set_attribute("printer.name", printer_name)
                print_span.set_attribute("job.file", file_path)

                def _print_file():
                    cups_conn = get_cups_conn()
                    return cups_conn.printFile(printer_name, file_path, filename, {})
                
                response = await asyncio.to_thread(_print_file)
                print_span.set_attribute("cups.job_id", str(response))


            logger.info(f"🧾 CUPS response: {response}")

            # 🔹 Completed
            async with pool.acquire() as conn:
                await add_event(conn, job_id, "COMPLETED", printer_id=printer_id)

            logger.info(f"✅ Job completed: {job_id}")
            span.set_attribute("job.status", "COMPLETED")

        except Exception as e:
            logger.error(f"❌ Job failed: {job_id} | {str(e)}")
            span.record_exception(e)
            span.set_status(trace.StatusCode.ERROR, str(e))

            async with pool.acquire() as conn:
                if retry_count >= 3:
                    await add_event(conn, job_id, "FAILED", printer_id=printer_id, error=str(e) )
                else:
                    await add_event(conn, job_id, "RETRY", printer_id=printer_id, error=str(e) , locked_until= (datetime.utcnow() + timedelta(minutes=5)) )

# -------------------------------------------------
# Worker loop
# -------------------------------------------------
job_queue = asyncio.Queue()

async def on_notification(conn, pid, channel, payload):
    logger.info(f"🔔 Notification received: job {payload}")
    await job_queue.put(payload)

async def poll_loop():
    while True:
        await job_queue.put("poll")
        await asyncio.sleep(30)

async def process_loop(pool):
    while True:
        try:
            payload = await job_queue.get()
            logger.info(f"⚙️ Processing triggered by: {payload}")
            await process_job(pool)
        except Exception as e:
            logger.error(f"💥 Error: {e}")

async def worker_loop():
    logger.info("🚀 Worker started")
    pool = await get_db_pool()

    listen_conn = await create_listening_pool()
    await listen_conn.add_listener('new_print_job', on_notification)
    logger.info("👂 Listening for NOTIFY on new_print_job")

    # Keep listener connection alive in the background
    async def keep_listener_alive():
        while True:
            await asyncio.sleep(3600)

    await asyncio.gather(
        process_loop(pool),
        poll_loop(),
        keep_listener_alive(),
    )

# -------------------------------------------------
# Entrypoint
# -------------------------------------------------

if __name__ == "__main__":
    asyncio.run(worker_loop())