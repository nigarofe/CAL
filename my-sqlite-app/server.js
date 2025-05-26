// server.js
const express = require('express');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

db.serialize(() => {
    db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS questions (
      question_number INTEGER PRIMARY KEY AUTOINCREMENT,
      discipline      TEXT    NOT NULL,
      source          TEXT    NOT NULL,
      description     TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      question_number  INTEGER NOT NULL,
      code             INTEGER NOT NULL,
      attempt_time     DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_number)
        REFERENCES questions(question_number)
        ON DELETE CASCADE
    );
  `);
});




const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());                // parse JSON bodies
app.use(express.static('public'));      // serve ./public on /

app.get('/api/questions', (req, res) => {
    db.all('SELECT * FROM questions', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
        console.log(rows);
    });
});



app.post('/api/sql', (req, res) => {
    const { SQL } = req.body;
    if (!SQL) return res.status(400).json({ error: 'SQL is required' });

    db.run(SQL, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'SQL executed', changes: this.changes });
    });
});




app.post('/api/questions/create', (req, res) => {
    const { discipline, source, description } = req.body;
    if (!discipline || !source || !description) {
        return res.status(400).json({ error: 'discipline, source, and description are required' });
    }

    const sql = `
        INSERT INTO questions (discipline, source, description)
        VALUES (?, ?, ?)
    `;
    db.run(sql, [discipline, source, description], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'Question created', 
            question_number: this.lastID 
        });
    });
});







// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
});