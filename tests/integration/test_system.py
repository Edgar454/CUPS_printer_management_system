
async def test_health(client):
    response = await client.get("/system/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "checks" in data
    assert "database" in data["checks"]
    assert data["checks"]["database"] is True

async def test_system_stats(client):
    response = await client.get("/system/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "completed" in data
    assert "failed" in data
    assert "processing" in data

async def test_queue_metrics(client):
    response = await client.get("/system/queue")
    assert response.status_code == 200
    data = response.json()
    assert "queued" in data
    assert "scheduled" in data

async def test_worker_status(client):
    response = await client.get("/system/workers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)