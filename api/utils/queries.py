# JOB QUERIES
CREATE_JOB_QUERY = """
WITH existing AS (
    SELECT job_id
    FROM job_events
    WHERE client_request_id = $1
    LIMIT 1
),
new_job AS (
    INSERT INTO print_jobs (
        id,
        file_name,
        file_path,
        printer_id,
        scheduled_at,
        submitted_by,
        status
    )
    SELECT
        gen_random_uuid(),
        $2, $3, $4,$5::timestamptz,
        'API',
        CASE WHEN $5 IS NULL THEN 'QUEUED' ELSE 'SCHEDULED' END
    WHERE NOT EXISTS (SELECT 1 FROM existing)
    RETURNING id, printer_id
),
target_job AS (
    SELECT id, printer_id FROM new_job
    UNION ALL
    SELECT job_id AS id, NULL AS printer_id FROM existing
    LIMIT 1
),
event_insert AS (
    SELECT public.add_job_event(
        t.id,
        CASE WHEN $5 IS NULL THEN 'CREATED' ELSE 'SCHEDULED' END,
        'API',
        t.printer_id,
        'Job created via API',
        $1,
        NULL
    )
    FROM target_job t
)
SELECT id FROM target_job;
"""

CHECK_JOB_EXISTENCE = """SELECT id
FROM print_jobs
WHERE id = $1;"""


GET_JOB_QUERY = """
SELECT 
    id,
    printer_id,
    file_name,
    file_path,
    status,
    scheduled_at,
    retry_count, 
    error_message,
    created_at,
    updated_at
FROM print_jobs 
WHERE id = $1::uuid;
"""

GET_JOBS_QUERY = """
WITH filtered AS (
    SELECT
        id,
        printer_id,
        file_name,
        file_path,
        pages,
        submitted_by,
        status,
        scheduled_at,
        retry_count,
        locked_by,
        locked_at,
        error_message,
        created_at,
        updated_at
    FROM print_jobs
    WHERE ($1::text IS NULL OR status = $1)
      AND ($2::int IS NULL OR printer_id = $2)
      AND ($3::text IS NULL OR submitted_by = $3)
),
counted AS (
    SELECT COUNT(*) AS total FROM filtered
)
SELECT 
    f.*,
    c.total
FROM filtered f, counted c
ORDER BY f.created_at DESC
LIMIT $4 OFFSET $5;
"""

CANCEL_JOB_QUERY = """
SELECT public.add_job_event(
    $1::uuid,
    'CANCELLED',
    'API',
    NULL,
    'Job cancelled via API',
    $2,
    NULL
);
"""

RETRY_JOB_QUERY = """
SELECT public.add_job_event(
    $1::uuid,
    'RETRY',
    'API',
    NULL,
    $2, -- message
    $3, -- client_request_id
    NULL
);
"""

GET_QUEUE_SIZE_QUERY = """SELECT COUNT(*) 
FROM print_jobs
WHERE printer_id = $1 
AND status = 'QUEUED';"""

GET_JOB_EVENTS_QUERY = """
SELECT 
    id,
    job_id,
    event_type,
    printer_id,
    message,
    error,
    source,
    created_at
FROM job_events
WHERE job_id = $1
ORDER BY created_at ASC, id ASC
LIMIT $2 OFFSET $3;
"""


# PRINTER QUERIES
GET_ALL_PRINTERS_QUERY = """SELECT * 
FROM printers
ORDER BY id"""

GET_PRINTER_QUERY = """SELECT * 
FROM printers 
WHERE name = $1 """

ADD_PRINTER_QUERY = """INSERT INTO printers (name , cups_uri , status) 
VALUES ($1, $2, $3)
RETURNING *;"""

DELETE_PRINTER_QUERY = """DELETE FROM printers
WHERE name = $1;"""

UPDATE_PRINTER_STATUS_QUERY = """UPDATE printers
SET status = $1
WHERE name = $2;"""



# SYSTEM QUERIES
GET_WORKER_STATUS_QUERY = """
        SELECT worker_id, last_seen,
        NOW() - last_seen AS lag
        FROM worker_heartbeat
    """
SYSTEM_STATS_QUERY = """
    SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') AS completed,
        COUNT(*) FILTER (WHERE status = 'FAILED') AS failed,
        COUNT(*) FILTER (WHERE status = 'PROCESSING') AS processing
    FROM print_jobs;
"""
QUEUE_METRICS_QUERY = """
    SELECT 
        COUNT(*) FILTER ( WHERE status = 'QUEUED') AS queued,
        COUNT(*) FILTER ( WHERE status = 'SCHEDULED' AND scheduled_at <= NOW() ) AS ready_to_queue
    FROM print_jobs;
"""