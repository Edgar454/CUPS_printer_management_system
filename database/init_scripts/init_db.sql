CREATE SCHEMA IF NOT EXISTS public;

-- ============================================================
-- Printer Table 
-- ============================================================
CREATE TABLE IF NOT EXISTS public.printers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    cups_uri TEXT NOT NULL,
    status TEXT NOT NULL check (status IN ('ONLINE','OFFLINE','ERROR')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

create index idx_printers_name on public.printers(name);
create index idx_printers_cups_uri on public.printers(cups_uri);

-- ============================================================
-- Print Jobs (Main event table)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    printer_id INTEGER REFERENCES public.printers(id) ON DELETE SET NULL,

    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    pages INTEGER,

    submitted_by TEXT,

    status TEXT NOT NULL CHECK (
        status IN ('QUEUED','PROCESSING','PRINTING','COMPLETED','FAILED')
    ),

    retry_count INTEGER DEFAULT 0,
    locked_by TEXT,
    locked_at TIMESTAMPTZ,

    error_message TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

create index idx_print_jobs_printer_id on public.print_jobs(printer_id);
create index idx_print_jobs_status on public.print_jobs(status);
create index idx_print_jobs_created_at on public.print_jobs(created_at);

