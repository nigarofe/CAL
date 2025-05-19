// server.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());                // parse JSON bodies
app.use(express.static('public'));      // serve ./public on /

// API: get all items
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: add a new item
app.post('/api/items', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    db.run(
        'INSERT INTO items(name) VALUES(?)',
        [name],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name });
        }
    );
});

// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});