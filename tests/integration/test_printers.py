import pytest

async def test_get_printers_returns_list(client):
    response = await client.get("/printers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

async def test_create_printer(client):
    response = await client.post("/printers/", json={
        "name": "TestPrinter",
        "cups_uri": "ipp://dummy:8631/ipp/print"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "TestPrinter"
    assert data["status"] == "ONLINE" 

async def test_get_printer(client):
    response = await client.get("/printers/TestPrinter")
    assert response.status_code == 200
    assert response.json()["name"] == "TestPrinter"

async def test_get_printer_not_found(client):
    response = await client.get("/printers/nonexistent")
    assert response.status_code == 404

async def test_delete_printer(client):
    response = await client.delete("/printers/TestPrinter")
    assert response.status_code == 200