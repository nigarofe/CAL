headersRow = 0;
toolTipsRow = 1;
visibilityRow = 2;
questionsStartRow = 3;

let requestCount = 0;

async function getUpdatedMatrix() {
    try {
        const matrix = rawCsvToMatrix(await requestCurrentRawCsv());
        console.log('matrix:', matrix);

        calculateNumberOfDaysSinceLastAttempt(matrix);
        calculateAttemptsSummary(matrix);
        calculateLoMIandLaMI(matrix);
        calculatePMG_XCellColor(matrix);

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



function registerQuestionAttempt(matrix, question_number, code) {
    const question = matrix.find(row => row['#'] === question_number);
    let qdv = question['Date Vector'];
    let qcv = question['Code Vector'];
    console.log('dateVector and codeVector for question', question_number, 'before api request = \n', qdv, '\n', qcv);

    const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (qdv == null || qdv == undefined || qdv == '') {
        // console.log('dateVector was null')
        qdv = today;
    } else if (qdv.includes(today)) {
        alert('You have already attempted this question today.');
    } else {
        qdv += ',' + today;
    }

    if (qcv == null || qcv == undefined || qcv == '') {
        // console.log('codeVector was null')
        qcv = code;
    } else {
        qcv += ',' + code;
    }

    requestToOverwriteCsv(matrixToRawCsv(matrix))
        .then(result => {
            console.log('Save operation completed:', result)
            if (code == 0) {
                showToast(`Done!`, `Question ${question_number} attempt registered successfully!<br>Code: ${code} <br> (I needed help to solve the question)`, today);
            } else {
                showToast(`Done!`, `Question ${question_number} attempt registered successfully!<br>Code: ${code} <br> (I solved the question without any external help)`, today);
            }
        }
        )
        .catch(error => {
            showToast('Error', 'Question attempt failled to save!', today);
            console.error('Save operation failed:', error)
        });

    console.log('dateVector and codeVector for question', question_number, 'after api request = \n', qdv, '\n', qcv);
    reloadPage();
}
