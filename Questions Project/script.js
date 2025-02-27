main();

matrix = [];
headersRow = 0;
toolTipsRow = 1;
visibilityRow = 2;
questionsStartRow = 3;
autoSaveEnabled = false;

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

function calculateAttemptsSummary() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let totalAttempts = 0;
        let attemptsWithoutHelp = 0;
        let attemptsWithHelp = 0;
        let lastAttemptMessage = '';

        const codeVector = matrix[i]['Code Vector'].replace(/[\[\]]/g, '').split(',');
        codeVector.forEach(code => {
            if (code == 1) {
                attemptsWithoutHelp++;
            } else {
                attemptsWithHelp++;
            }
            totalAttempts++;
        });

        if (codeVector[codeVector.length - 1] != 1) {
            lastAttemptMessage += 'W/H';
        } else {
            lastAttemptMessage += 'From memory';
        }

        let summary = [totalAttempts, attemptsWithoutHelp, attemptsWithHelp, lastAttemptMessage].join('; ');

        matrix[i]['Attempts Summary'] = summary;
    }
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
}

function updateTable() {
    const table = document.getElementById('questionsTable');
    table.innerHTML = '';
    calculateNumberOfDaysSinceLastAttempt();
    calculateAttemptsSummary();
    loadHTMLTable();
    const autoSaveSlider = document.getElementById('autoSaveSlider');
    if (autoSaveSlider && autoSaveSlider.checked) {
        saveCsvWithServer();
    }
}

function registerQuestionAttempt(questionNumber, code) {
    const question = matrix.find(row => row['#'] === questionNumber);
    const dateVector = question['Date Vector'];
    const today = new Date().toISOString().slice(0, 10);
    if (dateVector.includes(today)) {
        alert('You have already attempted this question today.');
    } else {
        question['Date Vector'] = dateVector.slice(0, -1) + ',' + today + ']';
        question['Code Vector'] = question['Code Vector'].slice(0, -1) + ',' + code + ']';
        updateTable()
        alert('Attempt registered for question number ' + questionNumber);
    }
}

function addActionButtonsToCellData(cellData, i) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-evenly'; // Equal space between and around
    buttonContainer.style.width = '100%'; // Take full width of the cell
    buttonContainer.style.padding = '5px 0'; // Add padding top and bottom

    const button0 = document.createElement('button');
    button0.textContent = '0';
    button0.onclick = function () {
        registerQuestionAttempt(matrix[i]['#'], 0);
    };
    buttonContainer.appendChild(button0);

    const button1 = document.createElement('button');
    button1.textContent = '1';
    button1.onclick = function () {
        registerQuestionAttempt(matrix[i]['#'], 1);
    };
    buttonContainer.appendChild(button1);

    cellData.appendChild(buttonContainer);
}

function getDslaColor(question_number) {
    const question = matrix.find(row => row['#'] === question_number);
    const dsla = parseInt(question['DSLA']);

    const dslaValues = matrix
        .filter(row => row['DSLA'] !== undefined)
        .map(row => parseInt(row['DSLA']))
        .filter(value => !isNaN(value));

    // Handle edge case where all values are the same
    const maxDSLA = Math.max(...dslaValues);
    const minDSLA = Math.min(...dslaValues);

    // If all values are the same or there's an issue with min/max,
    // return a default color to avoid division by zero
    if (maxDSLA === minDSLA || maxDSLA === -Infinity || minDSLA === Infinity) {
        return 'rgb(255, 255, 0)'; // Yellow as default
    }

    // Calculate the normalized position (0 to 1) of this value in the range
    // Invert the position so smaller values (recent attempts) get higher positions (greener)
    const normalizedPosition = 1 - (dsla - minDSLA) / (maxDSLA - minDSLA);

    // Red-Yellow-Green color scheme
    let red, green, blue = 0;

    if (normalizedPosition <= 0.5) {
        // First half: Red to Yellow (increase green)
        red = 255;
        green = Math.floor(255 * (normalizedPosition * 2));
    } else {
        // Second half: Yellow to Green (decrease red)
        red = Math.floor(255 * ((1 - normalizedPosition) * 2));
        green = 255;
    }

    return `rgb(${red},${green},${blue})`;
}

function loadHTMLTable() {
    htmlTable = document.getElementById('questionsTable');
    htmlTable.innerHTML = '';

    tableHead = document.createElement('thead');
    for (let i = 0; i < Object.keys(matrix[headersRow]).length; i++) {
        if (matrix[visibilityRow][Object.keys(matrix[headersRow])[i]] == 'TRUE') {
            const cellHeader = document.createElement('th');
            cellHeader.textContent = matrix[headersRow][Object.keys(matrix[headersRow])[i]];

            cellHeader.title = matrix[toolTipsRow][Object.keys(matrix[headersRow])[i]].replace(/\\n/g, '\n');
            cellHeader.style.cursor = 'help';
            cellHeader.style.borderBottom = '1px dotted #888';

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

                if (Object.keys(matrix[headersRow])[j] === 'DSLA') {
                    cellData.style.backgroundColor = getDslaColor(matrix[i]['#']);
                }

                if (Object.keys(matrix[headersRow])[j] === 'Action buttons') {
                    addActionButtonsToCellData(cellData, i);
                }

                tableRow.appendChild(cellData);
            }
        }
        tableBody.appendChild(tableRow);
    }
    htmlTable.appendChild(tableBody);
}

function saveCsvWithoutServer() {
    const headers = Object.keys(matrix[headersRow]);
    const csvContent = matrix.map(row => headers.map(header => row[header]).join('\t')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `questions_${today}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function saveCsvWithServer() {
    try {
        const headers = Object.keys(matrix[headersRow]);
        const csvContent = matrix.map(row => headers.map(header => row[header]).join('\t')).join('\n');

        const response = await fetch('http://localhost:3000/save-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: csvContent
        });

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        alert('Failed to save CSV to server. Check if the server running.');
    }
}

function addSavingOptions() {
    controls = document.getElementById('controls');

    // Create a container for the button and slider
    const optionsContainer = document.createElement('div');
    optionsContainer.style.display = 'flex';
    optionsContainer.style.alignItems = 'center';
    optionsContainer.style.marginTop = '10px';

    buttonSaveCsv = document.createElement('button');
    buttonSaveCsv.textContent = 'Save CSV Manually';
    buttonSaveCsv.onclick = saveCsvWithoutServer;
    optionsContainer.appendChild(buttonSaveCsv);

    // Create label for the slider
    const sliderLabel = document.createElement('label');
    sliderLabel.textContent = 'Save CSV automatically: ';
    sliderLabel.style.marginLeft = '10px';
    sliderLabel.style.marginRight = '10px';
    sliderLabel.htmlFor = 'autoSaveSlider'; // Make the entire label clickable

    // Create the slider (checkbox styled as a slider)
    const slider = document.createElement('input');
    slider.type = 'checkbox';
    slider.id = 'autoSaveSlider';
    slider.className = 'slider';
    slider.checked = autoSaveEnabled;

    // Add slider and label to container
    optionsContainer.appendChild(sliderLabel);
    optionsContainer.appendChild(slider);

    // Add container to controls
    controls.appendChild(optionsContainer);
}

async function main() {
    await loadMatrixFromCsv();
    updateTable();

    addSavingOptions();
}