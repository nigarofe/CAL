// server.js
// Lightweight CSV persistence Node.js backend
// --------------------------------------------
// Exposes two endpoints:
//   GET  /data  – returns the contents of data.csv
//   POST /data  – accepts updated CSV (or JSON array) and overwrites data.csv
//
// Environment variables (all optional):
//   PORT       – port to listen on (defaults to 3000)
//   DATA_FILE  – absolute or relative path to the CSV file (defaults to ./data.csv)
//
// Usage:
//   npm install express cors dotenv
//   node server.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "questions.csv");

// ────────────────────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────────────────────
app.use(cors()); // enable CORS for all origins (customize as needed)
app.use(express.text({ type: "text/csv" })); // capture raw CSV bodies
app.use(express.json()); // fallback: allow JSON bodies

// Ensure the CSV file exists so GET /data never 404s
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "", "utf8");
}

// ────────────────────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────────────────────

// GET /data → stream raw CSV back to client
app.get("/data", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("[GET /data] Read error:", err);
      return res.status(500).json({ error: "Failed to read data file" });
    }
    res.type("text/csv").send(data);
  });
});

// POST /data → overwrite CSV with body from client
app.post("/data", (req, res) => {
  let csv = "";

  if (req.is("text/csv")) {
    // Body already raw CSV
    csv = req.body;
  } else if (Array.isArray(req.body)) {
    // Body is JSON → convert array of objects to CSV
    const rows = req.body;
    if (!rows.length) {
      return res.status(400).json({ error: "No data provided" });
    }
    const headers = Object.keys(rows[0]);
    const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const lines = rows.map((row) => headers.map((h) => escape(row[h] ?? "")).join(","));
    csv = `${headers.join(",")}\n${lines.join("\n")}`;
  } else {
    return res.status(400).json({ error: "Unsupported content type" });
  }

  fs.writeFile(DATA_FILE, csv, "utf8", (err) => {
    if (err) {
      console.error("[POST /data] Write error:", err);
      return res.status(500).json({ error: "Failed to write data file" });
    }
    res.status(204).end(); // Success, no content
  });
});

// ────────────────────────────────────────────────────────────────
// Start server
// ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`CSV server listening at http://localhost:${PORT}`);
  console.log(`Using data file: ${DATA_FILE}`);
});
