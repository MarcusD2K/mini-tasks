import { useEffect, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const data = await listTasks();
      setTasks(data);
      setError("");
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask(title.trim());
    setTitle("");
    refresh();
  }

  async function toggleDone(t) {
    await updateTask(t._id, { done: !t.done });
    refresh();
  }

  async function remove(id) {
    await deleteTask(id);
    refresh();
  }

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Mini Tasks</h1>

      <form onSubmit={onAdd} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          style={{ flex: 1, padding: 8 }}
        />
        <button>Add</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {tasks.map((t) => (
          <li key={t._id} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: 8, border: "1px solid #ddd", marginBottom: 8
          }}>
            <input type="checkbox" checked={t.done} onChange={() => toggleDone(t)} />
            <span style={{ textDecoration: t.done ? "line-through" : "none", flex: 1 }}>
              {t.title}
            </span>
            <button onClick={() => remove(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
