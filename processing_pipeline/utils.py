import os
import ssl
import asyncpg

def get_asyncpg_connection_params():
        """
        Build asyncpg connection parameters from environment variables.
        Supports SSL if DB_SSLMODE is set.
        """
        sslmode = os.getenv('DB_SSLMODE', 'disable').lower()

        # Prepare SSL context if needed
        ssl_ctx = None
        if sslmode != 'disable':
            if sslmode in ('require', 'prefer'):
                # Basic SSL verification, default context
                ssl_ctx = True
            elif sslmode == 'verify-full':
                ssl_ctx = ssl.create_default_context(
                    cafile=os.getenv('DB_SSLROOTCERT')
                )
                certfile = os.getenv('DB_SSLCERT')
                keyfile = os.getenv('DB_SSLKEY')
                if certfile and keyfile:
                    ssl_ctx.load_cert_chain(certfile=certfile, keyfile=keyfile)
            else:
                raise ValueError(f"Unsupported DB_SSLMODE: {sslmode}")
        

        return {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': int(os.getenv('DB_PORT', 5432)),
            'database': os.getenv('DB_NAME', 'crypto_pipeline'),
            'user': os.getenv('DB_USER', 'admin'),
            'password': os.getenv('DB_PASSWORD', 'adminpassword'),
            'ssl': ssl_ctx,
            'min_size': int(os.getenv('DB_POOL_MIN', 5)),
            'max_size': int(os.getenv('DB_POOL_MAX', 10)),
        }

async def get_db_pool():
    asyncpg_params = get_asyncpg_connection_params()
    pool = await asyncpg.create_pool(**asyncpg_params)
    return pool

async def add_event(conn, job_id, event_type,printer_id=None, message=None, error=None):
    await conn.execute(
        """
        SELECT public.add_job_event(
            $1, $2,'WORKER',$3 ,$4, NULL, $5
        )
        """,
        job_id,
        event_type,
        printer_id,
        message,
        error
    )

async def get_next_job(conn):
    return await conn.fetchrow("""
        SELECT *
        FROM public.print_jobs
        WHERE status = 'QUEUED'
           OR (status = 'SCHEDULED' AND scheduled_at <= now())
        ORDER BY created_at
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    """)

async def is_cancelled(conn, job_id):
    status = await conn.fetchval(
        "SELECT status FROM public.print_jobs WHERE id = $1",
        job_id
    )
    return status == "CANCELLED"

async def get_printer_name(conn, printer_id):
    return await conn.fetchval(
        "SELECT name FROM public.printers WHERE id = $1",
        printer_id
    )