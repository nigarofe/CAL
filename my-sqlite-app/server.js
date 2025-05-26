// server.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());                // parse JSON bodies
app.use(express.static('public'));      // serve ./public on /

app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
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








// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});