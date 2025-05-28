// server.js
const express = require('express');
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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


app.get('/api/questions', (req, res) => {
    const sql = `
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


    db.all(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

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


function calculateDaysSinceLastAttempt(date_vector) {
    // All calculations in GMT-0, hence the 'Z' in the date string
    const today = Date.now();
    const last_attempt_date = new Date(date_vector[date_vector.length - 1] + 'Z').getTime();

    let result = (today - last_attempt_date) / MS_PER_DAY;
    return Math.floor(result);
}


function calculateLatestMemoryIntervalAndPotentialGain(code_vector, date_vector, days_since_last_attempt) {
    const memoryIntervals = [];
    for (let j = 1; j < code_vector.length; j++) {
        if (code_vector[j] === 1) {
            const prev = new Date(date_vector[j - 1]);
            const curr = new Date(date_vector[j]);
            memoryIntervals.push(
                Math.floor((curr - prev) / (1000 * 60 * 60 * 24))
            );
        }
    }
    const lastCode = code_vector[code_vector.length - 1];

    // If it was a single attempt
    if ((lastCode === 1 && code_vector.length === 1)) {
        latest_memory_interval = 'SA';
        potential_memory_gain_multiplier = 'SA';
        potential_memory_gain_in_days = days_since_last_attempt
    } else
        // If the last attempt was with help
        if (memoryIntervals.length === 0 || lastCode === 0) {
            latest_memory_interval = 'W/H';
            potential_memory_gain_multiplier = 'W/H';
            potential_memory_gain_in_days = days_since_last_attempt;
        } else {
            // Calculate latest_memory_interval and potential_memory_gain_multiplier
            memoryIntervals[memoryIntervals.length - 1] === 0 ?
                latest_memory_interval = 1 : latest_memory_interval = memoryIntervals[memoryIntervals.length - 1];
            potential_memory_gain_multiplier = (
                days_since_last_attempt / latest_memory_interval
            ).toFixed(2);
            potential_memory_gain_in_days = days_since_last_attempt - latest_memory_interval;
        }

    return {
        latest_memory_interval,
        potential_memory_gain_multiplier,
        potential_memory_gain_in_days
    };
}


function calculateAttemptsSummary(code_vector) {
    attempts_without_help = code_vector.filter(x => x === 1).length;
    attempts_with_help = code_vector.filter(x => x === 0).length;
    total_attempts = attempts_without_help + attempts_with_help;

    let last_attempt_message;
    if (!code_vector || code_vector.length === 0) {
        last_attempt_message = 'NA';
    } else {
        last_attempt_message = code_vector[code_vector.length - 1] !== 1
            ? 'W/H'
            : 'From memory';
    }
    attempts_summary = [
        total_attempts,
        attempts_without_help,
        attempts_with_help,
        last_attempt_message
    ].join('; ');

    return attempts_summary;
}


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
    db.run(sql, [discipline, source, description], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: 'Question created',
            question_number: this.lastID
        });
    });
});

app.post('/api/questions/attempt', (req, res) => {
    const { question_number, code } = req.body;

    const sql = `
        INSERT INTO attempts (question_number, code)
        VALUES (?, ?)
    `;
    db.run(sql, [question_number, code], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            message: 'Attempt recorded',
            id: this.lastID
        });
    });
});


function calculateCellColor(records, metric_name = 'potential_memory_gain_multiplier') {
    // Collect all *numeric* values that belong to the chosen metric
    const numericValues = records
        .map(r => parseFloat(r[metric_name]))
        .filter(v => !isNaN(v) && v >= 0);

    const maxVal = Math.max(...numericValues);
    const minVal = Math.min(...numericValues);
    const greatestIsGreen = false;     //  ←- the “PMG-X” rule

    records.forEach(r => {
        const v = r[metric_name];

        let colour;

        if (v === 'SA') colour = '128, 128, 0, 1';   // Single Attempt (no-help)
        else if (v === 'W/H') colour = '128, 0, 128, 1';   // Last round With Help
        else if (v === 'NA') colour = '0, 0, 200, 1';     // Never attempted
        else if (!isNaN(v) && v <= 1) colour = '0, 128, 0, 1';        // gain ≤ 1 → solid green
        else if (!isNaN(v)) {
            // numeric and > 1  → gradient
            if (maxVal === minVal) {                 // degenerate case: all the same
                colour = '128, 128, 128, 1';
            } else {
                const normalized = 1 - (v - minVal) / (maxVal - minVal);   // 0-->high, 1-->low
                let red, green; const blue = 0;

                if (greatestIsGreen) {
                    if (normalized <= 0.5) {          // red → yellow
                        green = 255;
                        red = Math.floor(255 * (normalized * 2));
                    } else {                          // yellow → green
                        green = Math.floor(255 * ((1 - normalized) * 2));
                        red = 255;
                    }
                } else {
                    if (normalized <= 0.5) {          // green → yellow
                        red = 255;
                        green = Math.floor(255 * (normalized * 2));
                    } else {                          // yellow → red
                        red = Math.floor(255 * ((1 - normalized) * 2));
                        green = 255;
                    }
                }
                colour = `${red}, ${green}, ${blue}, 1`;
            }
        } else {
            colour = '128, 128, 128, 1';              // fallback / corrupt value
        }

        r['PMG-X Cell Color'] = colour;               // attach to the current record
    });
}


// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
});


