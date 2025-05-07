headersRow = 0;
toolTipsRow = 1;
visibilityRow = 2;
questionsStartRow = 3;

let requestCount = 0;

async function getUpdatedMatrix() {
    try {
        const matrix = rawCsvToMatrix(await requestCurrentRawCsv());

        calculateNumberOfDaysSinceLastAttempt(matrix);
        calculateAttemptsSummary(matrix);
        calculateLoMIandLaMI(matrix);
        
        requestToOverwriteCsv(matrixToRawCsv(matrix));

        return matrix;
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
        console.log(requestCount)
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
    // 1) Build the plain matrix (exactly as before)
    const matrix = rawCsv
        .replace(/\r?\n$/, '')      // trim a trailing newline
        .split('\n')                // split into rows
        .map(r => r.split('\t'));   // split each row into cells

    // 2) Attach header‑based accessors to each data row
    // So I can call both matrix[i][5] and matrix[i]['Date Vector']

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
    return matrix.map(row => row.join('\t')).join('\n') + '\n';
}
