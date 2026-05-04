INSERT INTO public.printers (name, cups_uri, status)
VALUES (
    'PDF',
    'ipp://cups_server:631/printers/PDF',
    'ONLINE'
);

INSERT INTO job_state_transitions VALUES
    ('SCHEDULED', 'PROCESSING'),
    ('SCHEDULED', 'QUEUED'),
    ('QUEUED', 'PROCESSING'),
    ('PROCESSING', 'PRINTING'),
    ('PRINTING', 'COMPLETED'),
    ('PROCESSING', 'FAILED'),
    ('PRINTING', 'FAILED'),
    ('QUEUED','QUEUED'),
    ('PROCESSING','PROCESSING'),
    ('PRINTING','PRINTING'),
    ('FAILED', 'FAILED'),
    ('COMPLETED', 'COMPLETED'), -- optional safety
    ('FAILED', 'QUEUED'), -- retry
    ('QUEUED', 'CANCELLED'),
    ('PROCESSING', 'CANCELLED'),
    ('PRINTING', 'CANCELLED'),
    ('ANY','QUEUED'), -- allow retry from any state
    ('ANY', 'CANCELLED'); -- allow cancellation from any state