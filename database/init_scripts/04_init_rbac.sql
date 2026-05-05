\c postgres;
-- ============================================
-- ROLE 1: API USER
-- ============================================

CREATE ROLE api_user LOGIN PASSWORD 'api_user_password';

GRANT CONNECT ON DATABASE postgres TO api_user;
GRANT USAGE ON SCHEMA public TO api_user;

GRANT SELECT, INSERT, UPDATE ON TABLE public.printers TO api_user;
GRANT SELECT, INSERT, UPDATE ON TABLE public.print_jobs TO api_user;
GRANT SELECT, INSERT, UPDATE ON TABLE public.job_events TO api_user;
GRANT SELECT ON TABLE public.worker_heartbeat TO api_user;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO api_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api_user;

-- ============================================
-- ROLE 2: Pipeline Worker 
-- ============================================

CREATE ROLE pipeline_worker LOGIN PASSWORD 'pipeline_worker_password';

GRANT CONNECT ON DATABASE postgres TO pipeline_worker;
GRANT USAGE ON SCHEMA public TO pipeline_worker;

GRANT SELECT ON TABLE public.printers TO pipeline_worker;
GRANT SELECT, INSERT, UPDATE ON TABLE public.print_jobs TO pipeline_worker;
GRANT SELECT, INSERT , UPDATE ON TABLE public.job_events TO pipeline_worker;
GRANT SELECT, INSERT ON TABLE public.job_outputs TO pipeline_worker;
GRANT SELECT, INSERT, UPDATE ON TABLE public.worker_heartbeat TO pipeline_worker;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO pipeline_worker;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pipeline_worker;


-- ============================================
-- ROLE 3: Postgres Monitor 
-- ============================================
CREATE USER postgres_exporter LOGIN PASSWORD 'exporter_password';
GRANT pg_monitor, pg_read_all_stats  TO postgres_exporter;


GRANT CONNECT ON DATABASE postgres TO postgres_exporter;

-- Also grant usage on the schemas
GRANT USAGE ON SCHEMA public TO postgres_exporter;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO postgres_exporter;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT ON TABLES TO postgres_exporter;

-- ============================================
-- ROLE 4: Grafana User 
-- ============================================
CREATE ROLE grafana_user LOGIN PASSWORD 'grafana_user_password';
GRANT CONNECT ON DATABASE postgres TO grafana_user;
GRANT USAGE ON SCHEMA public TO grafana_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO grafana_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO grafana_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT ON TABLES TO grafana_user;