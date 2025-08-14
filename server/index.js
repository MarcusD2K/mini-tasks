const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI env var. Set it on Render (Environment tab).");
  process.exit(1);
}

console.log("✅ Server starting...");
console.log("PORT:", process.env.PORT || 8080);
console.log("CORS origins:", process.env.ALLOW_ORIGIN || "*");


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN ? process.env.ALLOW_ORIGIN.split(",") : true,
  })
);

// ----- Mongoose -----
const taskSchema = new mongoose.Schema(
  { title: { type: String, required: true }, done: { type: Boolean, default: false } },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);

// ----- Routes -----
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/tasks", async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "title required" });
  const created = await Task.create({ title: title.trim() });
  res.status(201).json(created);
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "invalid id" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "invalid id" });
  }
});

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API running → http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });
