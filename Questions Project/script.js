main();

matrix = [];
headersRow = 0;
toolTipsRow = 1;
visibilityRow = 2;
questionsStartRow = 3;

async function loadMatrixFromCsv() {
    const response = await fetch('questions.csv');
    const responseText = await response.text();

    // Split into rows and columns
    const rawData = responseText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(row => row.split('\t'));

    // Get the header row (first row)
    const headers = rawData[0];

    // Convert each data row into an object with keys from headers
    matrix = rawData
        .filter(row => row.length === headers.length && row.some(cell => cell.trim() !== '')) // Filter out empty rows
        .map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });

    // console.log(matrix);
    // const question14 = matrix.find(row => row['#'] === '14')['Code Vector'];
    // console.log(question14);
}

function calculateNumberOfDaysSinceLastAttempt() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        const dateStrings = matrix[i]['Date Vector'].replace(/[\[\]]/g, '').split(',');
        const lastDate = new Date(dateStrings[dateStrings.length - 1]);
        const today = new Date();

        const timeDifferenceInMs = today - lastDate;
        const timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));

        matrix[i]['DSLA'] = timeDifferenceInDays;
    }

    console.log(matrix);
}

function loadHTMLTable() {
    htmlTable = document.getElementById('questionsTable');
    htmlTable.innerHTML = '';

    tableHead = document.createElement('thead');
    for (let i = 0; i < Object.keys(matrix[headersRow]).length; i++) {
        if (matrix[visibilityRow][Object.keys(matrix[headersRow])[i]] == 'TRUE') {
            const cellHeader = document.createElement('th');
            cellHeader.textContent = matrix[headersRow][Object.keys(matrix[headersRow])[i]];
            tableHead.appendChild(cellHeader); 
        }
    }
    htmlTable.appendChild(tableHead);

    tableBody = document.createElement('tbody');
    for (let i = questionsStartRow; i < matrix.length; i++) {
        tableRow = document.createElement('tr');
        for (let j = 0; j < Object.keys(matrix[headersRow]).length; j++) {
            if (matrix[visibilityRow][Object.keys(matrix[headersRow])[j]] == 'TRUE') {
                const cellData = document.createElement('td');
                cellData.textContent = matrix[i][Object.keys(matrix[headersRow])[j]];
                tableRow.appendChild(cellData);
            }
        }
        tableBody.appendChild(tableRow);
    }
    htmlTable.appendChild(tableBody);
}

async function main() {
    await loadMatrixFromCsv();
    calculateNumberOfDaysSinceLastAttempt();
    loadHTMLTable();
}