-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SCHEMA
-- ============================================================
CREATE SCHEMA IF NOT EXISTS public;

-- ============================================================
-- PRINTERS
-- ============================================================
CREATE TABLE public.printers (
    id SERIAL PRIMARY KEY,

    name TEXT NOT NULL UNIQUE,
    cups_uri TEXT NOT NULL,

    status TEXT NOT NULL CHECK (
        status IN ('ONLINE', 'OFFLINE', 'ERROR')
    ),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_printers_name ON public.printers(name);
CREATE INDEX idx_printers_status ON public.printers(status);

-- ============================================================
-- PRINT JOBS (SNAPSHOT STATE)
-- ============================================================
CREATE TABLE public.print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    printer_id INTEGER
        REFERENCES public.printers(id)
        ON DELETE SET NULL,

    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    pages INTEGER,

    submitted_by TEXT,

    status TEXT NOT NULL CHECK (
        status IN (
            'SCHEDULED',
            'QUEUED',
            'PROCESSING',
            'PRINTING',
            'COMPLETED',
            'CANCELLED',
            'FAILED'
        )
    ),

    scheduled_at TIMESTAMPTZ,

    retry_count INTEGER DEFAULT 0,

    locked_by TEXT,
    locked_at TIMESTAMPTZ,

    error_message TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CHECK (
        (status = 'SCHEDULED' AND scheduled_at IS NOT NULL)
        OR
        (status <> 'SCHEDULED')
    )
);

CREATE INDEX idx_print_jobs_status ON public.print_jobs(status);
CREATE INDEX idx_print_jobs_printer_id ON public.print_jobs(printer_id);
CREATE INDEX idx_print_jobs_created_at ON public.print_jobs(created_at);
CREATE INDEX idx_print_jobs_scheduled_at ON public.print_jobs(scheduled_at);

-- ============================================================
-- JOB STATE TRANSITIONS
-- ============================================================

CREATE TABLE job_state_transitions (
    from_state TEXT,
    to_state   TEXT,
    PRIMARY KEY (from_state, to_state)
);

-- ============================================================
-- JOB EVENTS (SOURCE OF TRUTH)
-- ============================================================
CREATE TABLE public.job_events (
    id BIGSERIAL PRIMARY KEY,

    job_id UUID NOT NULL
        REFERENCES public.print_jobs(id)
        ON DELETE CASCADE,

    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'CREATED',
            'SCHEDULED',
            'QUEUED',
            'PROCESSING_STARTED',
            'PRINTING_STARTED',
            'COMPLETED',
            'FAILED',
            'CANCELLED',
            'RETRY'
        )
    ),

    printer_id INTEGER
        REFERENCES public.printers(id)
        ON DELETE SET NULL,

    message TEXT,
    error TEXT,

    source TEXT NOT NULL, -- e.g. 'API', 'WORKER', 'SCHEDULER'

    client_request_id TEXT CHECK ((client_request_id IS NOT NULL AND source = 'API') OR client_request_id IS NULL),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_events_job_id
    ON public.job_events(job_id);

CREATE INDEX idx_job_events_job_id_created_at
    ON public.job_events(job_id, created_at DESC);

CREATE INDEX idx_job_events_event_type
    ON public.job_events(event_type);

CREATE UNIQUE INDEX uniq_api_idempotency
ON public.job_events(job_id, client_request_id, event_type)
WHERE client_request_id IS NOT NULL;

-- ============================================================
-- JOB OUTPUTS 
-- ============================================================
CREATE TABLE public.job_outputs (
    id BIGSERIAL PRIMARY KEY,

    job_id UUID NOT NULL
        REFERENCES public.print_jobs(id)
        ON DELETE CASCADE,

    file_path TEXT NOT NULL,
    file_size INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_outputs_job_id
    ON public.job_outputs(job_id);

-- ============================================================
-- WORKER HEARTBEAT
-- ============================================================
CREATE TABLE worker_heartbeat (
    worker_id TEXT PRIMARY KEY,
    last_seen TIMESTAMPTZ NOT NULL
);

