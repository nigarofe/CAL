loadHTMLTable();

function loadHTMLTable() {
    getMatrix().then(result => {
        matrix = result;
        htmlTable = document.getElementById('questionsTable');
        htmlTable.innerHTML = '';

        calculateNumberOfDaysSinceLastAttempt();
        calculateAttemptsSummary();
        calculateLoMI();

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
    });
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


function calculateNumberOfDaysSinceLastAttempt() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        const dateStrings = matrix[i]['Date Vector'].replace(/[\[\]]/g, '').split(',');
        const lastDate = new Date(dateStrings[dateStrings.length - 1]);
        const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);

        const timeDifferenceInMs = today - lastDate;
        const timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));

        matrix[i]['DSLA'] = timeDifferenceInDays;
    }
}

function calculateAttemptsSummary() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let totalAttempts = 0;
        let attemptsWithoutHelp = 0;
        let attemptsWithHelp = 0;
        let lastAttemptMessage = '';

        let codeVector = matrix[i]['Code Vector'];
        if (typeof codeVector === 'number') {
            codeVector = [codeVector];
        } else {
            codeVector = codeVector.replace(/[\[\]]/g, '').split(',').map(Number);
        }

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

function calculateLoMI() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let memoryIntervals = [];

        let codeVector = matrix[i]['Code Vector'];
        if (typeof codeVector === 'number') {
            codeVector = [codeVector];
        } else {
            codeVector = codeVector.replace(/[\[\]]/g, '').split(',').map(Number);
        }

        let dateStrings = matrix[i]['Date Vector'].replace(/[\[\]]/g, '').split(',');

        // console.log('Code Vector:', codeVector);
        for (let j = 1; j < codeVector.length; j++) {
            if (codeVector[j] == 1 && codeVector[j - 1] == 1) {
                let timeDifferenceInMs = new Date(dateStrings[j]) - new Date(dateStrings[j - 1]);
                let timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));
                memoryIntervals.push(timeDifferenceInDays);
            }
        }


        if (memoryIntervals.length > 0) {
            const maxInterval = Math.max(...memoryIntervals);
            matrix[i]['LoMI'] = maxInterval;
        } else {
            matrix[i]['LoMI'] = '-'; // Default value if no intervals
        }
    }
}