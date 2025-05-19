// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

// Create a table if it doesn't exist yet
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
});

module.exports = db;
