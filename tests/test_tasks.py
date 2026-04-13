"""Task endpoint tests."""

from fastapi.testclient import TestClient


def test_create_task(client: TestClient) -> None:
    payload = {"title": "Prepare release notes", "description": "Write release summary", "status": "pending"}
    response = client.post("/tasks", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["status"] == payload["status"]
    assert data["creation_date"] is not None


def test_get_all_tasks(client: TestClient) -> None:
    client.post("/tasks", json={"title": "Task one", "description": "A", "status": "pending"})
    client.post("/tasks", json={"title": "Task two", "description": "B", "status": "completed"})

    response = client.get("/tasks")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_task_by_id(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Find by id", "description": "Check retrieval", "status": "pending"})
    task_id = created.json()["id"]

    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id


def test_update_task(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Initial title", "description": "Initial", "status": "pending"})
    task_id = created.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={"title": "Updated title", "description": "Updated", "status": "completed"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated title"
    assert data["status"] == "completed"


def test_delete_task(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Delete me", "description": "To remove", "status": "pending"})
    task_id = created.json()["id"]

    delete_response = client.delete(f"/tasks/{task_id}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404


def test_filter_tasks_by_status(client: TestClient) -> None:
    client.post("/tasks", json={"title": "Pending task", "description": "A", "status": "pending"})
    client.post("/tasks", json={"title": "Done task", "description": "B", "status": "completed"})

    response = client.get("/tasks?status=completed")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["status"] == "completed"


def test_validation_failure_empty_title(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "", "description": "Invalid", "status": "pending"})

    assert response.status_code == 422
    payload = response.json()
    assert payload["error"]["type"] == "validation_error"


def test_validation_failure_whitespace_title(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "   ", "description": "Invalid", "status": "pending"})

    assert response.status_code == 422
    payload = response.json()
    assert payload["error"]["type"] == "validation_error"


def test_update_validation_failure_whitespace_title(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Keep me", "description": "Valid", "status": "pending"})
    task_id = created.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"title": "   "})
    assert response.status_code == 422
    payload = response.json()
    assert payload["error"]["type"] == "validation_error"


def test_task_not_found(client: TestClient) -> None:
    response = client.get("/tasks/99999")
    assert response.status_code == 404
    payload = response.json()
    assert payload["error"]["type"] == "not_found"
