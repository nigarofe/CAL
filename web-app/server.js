// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

const {
    MS_PER_DAY,
    calculateDaysSinceLastAttempt,
    calculateLatestMemoryIntervalAndPotentialGain,
    calculateAttemptsSummary
} = require('./lib/attemptCalculations');
const { calculateCellColor } = require('./lib/colorService');

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
      attempt_datetime     DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (question_number)
        REFERENCES questions(question_number)
        ON DELETE CASCADE
    );
  `);
});



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

app.use(
    '/node_modules',
    express.static(path.join(__dirname, 'node_modules'))
);

const GET_QUESTIONS_SQL = `
    SELECT
  q.*,
  COALESCE(
    json_group_array(a.code ORDER BY a.attempt_datetime), '[]' ) AS code_vec_json,
  COALESCE(
    json_group_array(a.attempt_datetime ORDER BY a.attempt_datetime), '[]' ) AS date_vec_json
    FROM questions AS q
    LEFT JOIN attempts AS a
    ON a.question_number = q.question_number
    GROUP BY q.question_number
  `;

app.get('/api/questions', (req, res) => {
    db.all(GET_QUESTIONS_SQL, (err, rows) => {
        if (err) {
            console.error('Error executing SQL:', err)
            return res.status(500).json({ error: err.message });
        }

        const enriched = rows.map(row => {
            const code_vector = JSON.parse(row.code_vec_json);
            const date_vector = JSON.parse(row.date_vec_json);

            let latest_memory_interval = 'ERROR',
                potential_memory_gain_in_days = 'ERROR',
                potential_memory_gain_multiplier = 'ERROR',
                days_since_last_attempt = 'ERROR',
                attempts_summary = 'ERROR';

            if (!date_vector || date_vector.length === 0 || date_vector.every(v => v == null)) {
                potential_memory_gain_multiplier = 'NA';
                potential_memory_gain_in_days = 'NA';
                latest_memory_interval = 'NA';
                days_since_last_attempt = 'NA';
                attempts_summary = 'NA';
            } else {
                days_since_last_attempt = calculateDaysSinceLastAttempt(date_vector);
                attempts_summary = calculateAttemptsSummary(code_vector);

                ({
                    latest_memory_interval,
                    potential_memory_gain_multiplier,
                    potential_memory_gain_in_days
                } = calculateLatestMemoryIntervalAndPotentialGain(code_vector, date_vector, days_since_last_attempt))
            }

            return {
                // ...row,
                question_number: row.question_number,
                discipline: row.discipline,
                source: row.source,
                description: row.description,
                days_since_last_attempt,
                latest_memory_interval,
                potential_memory_gain_in_days,
                potential_memory_gain_multiplier,
                attempts_summary,
                date_vector: date_vector
            };
        });

        calculateCellColor(enriched, 'potential_memory_gain_multiplier');

        res.json(enriched);
    });
});


app.post('/api/questions/create', (req, res) => {
    const { discipline, source, description } = req.body;

    const sql = `
        INSERT INTO questions (discipline, source, description)
        VALUES (?, ?, ?)
    `;
    db.run(sql, [discipline, source, description], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: 'Question created',
            question_number: this.lastID
        });
    });
});



const INSERT_ATTEMPT_SQL = `
    INSERT INTO attempts (question_number, code)
    VALUES (?, ?)
`;

app.post('/api/questions/attempt', (req, res) => {
    const { question_number, code } = req.body;
    db.run(INSERT_ATTEMPT_SQL, [question_number, code], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: 'Attempt recorded',
            id: this.lastID
        });
    });
});



app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
});


