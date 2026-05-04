-- ============================================================
-- FUNCTION: ADD EVENT + UPDATE SNAPSHOT
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_job_event(
    p_job_id UUID,
    p_event_type TEXT,
    p_source TEXT ,
    p_printer_id INTEGER DEFAULT NULL,
    p_message TEXT DEFAULT NULL,
    p_client_request_id TEXT DEFAULT NULL,
    p_error TEXT DEFAULT NULL ,
    p_locked_until TIMESTAMPTZ DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    new_state TEXT;
    current_state TEXT;
BEGIN
    -- 1. Lock + fetch current state (prevents race conditions)
    SELECT status
    INTO current_state
    FROM public.print_jobs
    WHERE id = p_job_id
    FOR UPDATE;

    IF current_state IS NULL THEN
        RAISE EXCEPTION 'Job % does not exist', p_job_id;
    END IF;

    -- 2. Ignore terminal state transitions (except retry)
    IF current_state IN ('COMPLETED', 'FAILED', 'CANCELLED')
       AND p_event_type <> 'RETRY'
    THEN
        RETURN;
    END IF;

    -- 3. Map event → state
    new_state := CASE
        WHEN p_event_type = 'CREATED' THEN 'QUEUED'
        WHEN p_event_type = 'QUEUED' THEN 'QUEUED'
        WHEN p_event_type = 'SCHEDULED' THEN 'SCHEDULED'
        WHEN p_event_type = 'PROCESSING_STARTED' THEN 'PROCESSING'
        WHEN p_event_type = 'PRINTING_STARTED' THEN 'PRINTING'
        WHEN p_event_type = 'COMPLETED' THEN 'COMPLETED'
        WHEN p_event_type = 'FAILED' THEN 'FAILED'
        WHEN p_event_type = 'RETRY' THEN 'QUEUED'
        WHEN p_event_type = 'CANCELLED' THEN 'CANCELLED'
        ELSE NULL
    END;

    IF new_state IS NULL THEN
        RAISE EXCEPTION 'Unknown event type: %', p_event_type;
    END IF;

    -- 4. Validate transition
    IF NOT EXISTS (
        SELECT 1
        FROM job_state_transitions
        WHERE (from_state = current_state OR from_state = 'ANY')
          AND to_state = new_state
    ) THEN
        RAISE EXCEPTION 'Invalid state transition % -> %', current_state, new_state;
    END IF;

    -- 5. Insert event (idempotent)
    INSERT INTO public.job_events (
        job_id,
        event_type,
        printer_id,
        message,
        source,
        client_request_id,
        error
    )
    VALUES (
        p_job_id,
        p_event_type,
        p_printer_id,
        p_message,
        p_source,
        p_client_request_id,
        p_error
    )
    ON CONFLICT (job_id, client_request_id, event_type)
    WHERE client_request_id IS NOT NULL
    DO NOTHING;

    -- 6. Always update snapshot (do NOT depend on insert success)
    UPDATE public.print_jobs
    SET status = new_state,
        error_message = CASE
            WHEN p_event_type = 'FAILED' THEN p_error
            WHEN p_event_type = 'RETRY' THEN NULL
            ELSE error_message
        END,
        retry_count = CASE
            WHEN p_event_type = 'RETRY' THEN retry_count + 1
            ELSE retry_count
        END,
        locked_until= p_locked_until,
        updated_at = NOW()

    WHERE id = p_job_id;

END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGER: AUTO UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_print_jobs_updated_at
BEFORE UPDATE ON public.print_jobs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_printers_updated_at
BEFORE UPDATE ON public.printers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();