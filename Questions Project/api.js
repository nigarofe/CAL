let headersRow = 0;
let toolTipsRow = 1;
let visibilityRow = 2;
let questionsStartRow = 3;

let matrix = [];
let last_matrix_update = 'never';

let requestCount = 0;

async function updateMatrixVariable() {
    try {
        matrix = rawCsvToMatrix(await requestCurrentRawCsv());
        console.log('matrix:', matrix);

        calculateNumberOfDaysSinceLastAttempt();
        calculateAttemptsSummary();
        calculateLoMIandLaMI();
        calculatePMG_XCellColor();

        requestToOverwriteCsv(matrixToRawCsv(matrix));
    } catch (err) {
        console.error('Error getting matrix:', err);
    }
}

async function requestCurrentRawCsv() {
    try {
        const res = await fetch('http://localhost:3000/data');

        if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
        }

        requestCount++
        // console.log(requestCount)
        return await res.text();
    } catch (err) {
        console.error('Fetch error:', err);
        alert('Could not reach the CSV server – is it running?');
    }
}

async function requestToOverwriteCsv(rawCsv) {
    try {
        const res = await fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/csv'
            },
            body: rawCsv
        });

        if (res.ok) {
            console.log(`CSV overwritten successfully with status: ${res.status}`);
        } else {
            throw new Error(`Server responded with ${res.status}`);
        }
    } catch (err) {
        console.error('Upload error:', err);
        alert('Could not write to the CSV server – is it running?');
    }
}

function rawCsvToMatrix(rawCsv) {
    const rows = rawCsv
        .trimEnd()               // removes trailing \r\n or \n
        .split(/\r?\n/);         // handles \n AND \r\n cleanly

    const matrix = rows.map(r =>
        r.split('\t').map(cell => cell.trim())   // <‑‑ removes \r, spaces, tabs
    );

    const headers = matrix[headersRow];               // row 0 by convention
    for (let r = questionsStartRow; r < matrix.length; r++) {
        const row = matrix[r];

        headers.forEach((header, c) => {
            if (!header || header.trim() === '') return;   // ignore blank headers
            if (Object.prototype.hasOwnProperty.call(row, header)) return; // don’t overwrite

            Object.defineProperty(row, header, {
                get() { return this[c]; },
                set(v) { this[c] = v; },
                enumerable: false,      // keeps console.log(row) tidy
                configurable: false
            });
        });
    }

    return matrix;
}

function matrixToRawCsv(matrix) {
    return (
        matrix
            .map(row => row.join('\t'))   // tab‑separated
            .join('\r\n')                 // CRLF between rows
        + '\r\n'                        // final newline (optional, good style)
    );
}

