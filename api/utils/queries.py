CREATE_JOB_QUERY = """
    INSERT INTO print_jobs (
        id,
        file_name,
        file_path,
        printer_id,
        status,
        submitted_by
    )
    VALUES ($1, $2, $3, $4, 'QUEUED', $5);
"""

GET_JOB_QUERY = """SELECT * 
            FROM print_jobs 
            WHERE id = $1"""

GET_PRINTER_QUERY = """SELECT id 
FROM printers 
WHERE name = $1"""