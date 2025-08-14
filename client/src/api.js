const BASE = import.meta.env.VITE_API_URL;

export async function listTasks() {
  const r = await fetch(`${BASE}/api/tasks`);
  return r.json();
}

export async function createTask(title) {
  const r = await fetch(`${BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  return r.json();
}

export async function updateTask(id, data) {
  const r = await fetch(`${BASE}/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return r.json();
}

export async function deleteTask(id) {
  const r = await fetch(`${BASE}/api/tasks/${id}`, { method: "DELETE" });
  return r.json();
}
