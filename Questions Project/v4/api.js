const rawCsvBeforeEdit = requestRawCsv().then((rawCsvBeforeEdit) => {
    // console.log('rawCsv =', rawCsv);
    const matrixBeforeEdit = rawCsvToMatrix(rawCsvBeforeEdit);
    const rawCsvAfterEdit = matrixToRawCsv(matrixBeforeEdit);



    const normalize = s => s.replace(/\r\n/g, '\n');  // strip all \r
    if (normalize(rawCsvAfterEdit) === normalize(rawCsvBeforeEdit)) {
        console.log('rawCsvAfterEdit is equal to rawCsvBeforeEdit after normalizing');
    }

    requestToOverwriteCsv(rawCsvAfterEdit);
    console.log(rawCsvAfterEdit);
});


async function requestRawCsv() {
    try {
        const res = await fetch('http://localhost:3000/data');

        if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
        }

        return await res.text();;
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
    const rows = rawCsv.replace(/\r?\n$/, '').split('\n');
    return rows.map(row => row.split('\t'));
}

function matrixToRawCsv(matrix) {
    return matrix.map(row => row.join('\t')).join('\n') + '\n';
}
