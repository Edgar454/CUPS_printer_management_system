import pytest
from uuid import uuid4

CLIENT_REQUEST_ID = str(uuid4())
JOB_ID = None

async def test_get_jobs_returns_list(client):
    response = await client.get("/jobs/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)

async def test_create_job(client):
    global JOB_ID
    response = await client.post("/jobs/", json={
        "file_name": "test.pdf",
        "file_path": "test.pdf",
        "printer_id": 1,
        "client_request_id": CLIENT_REQUEST_ID,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["file_name"] == "test.pdf"
    assert data["status"] in ("QUEUED", "SCHEDULED")
    JOB_ID = data["id"]

async def test_create_job_idempotent(client):
    # same client_request_id should return same job
    response = await client.post("/jobs/", json={
        "file_name": "test.pdf",
        "file_path": "test.pdf",
        "printer_id": 1,
        "client_request_id": CLIENT_REQUEST_ID,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == JOB_ID

async def test_get_job(client):
    response = await client.get(f"/jobs/{JOB_ID}")
    assert response.status_code == 200
    assert response.json()["id"] == JOB_ID

async def test_get_job_not_found(client):
    response = await client.get(f"/jobs/{uuid4()}")
    assert response.status_code == 404

async def test_get_job_events(client):
    response = await client.get(f"/jobs/{JOB_ID}/events")
    assert response.status_code == 200
    events = response.json()
    assert isinstance(events, list)
    assert len(events) > 0
    assert events[0]["event_type"] == "CREATED"

async def test_cancel_job(client):
    response = await client.post(
        f"/jobs/{JOB_ID}/cancel",
        params={"client_request_id": str(uuid4())}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "CANCELLED"

async def test_get_recent_events(client):
    response = await client.get("/jobs/events", params={"limit": 10})
    assert response.status_code == 200
    assert isinstance(response.json(), list)