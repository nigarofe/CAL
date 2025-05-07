const rawCsvBeforeEdit = requestRawCsv().then((rawCsvBeforeEdit) => {
    // console.log('rawCsv =', rawCsv);
    const matrixBeforeEdit = rawCsvToMatrix(rawCsvBeforeEdit);
    console.log('matrixBeforeEdit =', matrixBeforeEdit);

    const rawCsvAfterEdid = matrixToRawCsv(matrixBeforeEdit);
    console.log('rawCsvBeforeEdit =', rawCsvBeforeEdit);
    console.log('rawCsvAfterEdit =', rawCsvAfterEdid);

    const normalize = s => s.replace(/\r\n/g, '\n');  // strip all \r
    if (normalize(rawCsvAfterEdid) === normalize(rawCsvBeforeEdit)){
        console.log('rawCsvAfterEdit is equal to rawCsvBeforeEdit after normalizing');
    }
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



function rawCsvToMatrix(rawCsv) {
    const rows = rawCsv.replace(/\r?\n$/, '').split('\n');
    return rows.map(row => row.split('\t'));
}

function matrixToRawCsv(matrix) {
    return matrix.map(row => row.join('\t')).join('\n') + '\n';
}
