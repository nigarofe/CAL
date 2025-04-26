window.addEventListener("DOMContentLoaded", () => {
    loadHTMLQuestionsTableMini()
    loadHTMLQuestionsTable();
    showToast("Hello!", "Have a nice day!", ":)");

    // openObsidianNote(68);
})

document.querySelectorAll('input[name="metric"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
        selectedLabelTextContent = selectedLabel.textContent
        loadHTMLQuestionsTableMini(selectedLabelTextContent);
    });
});



function openObsidianNote(question_number) {
    const vault = '1 Obsidian Vault'; // Replace with your vault name
    const file = `5 git\\PKM\\Questions Project\\Questions .md\\q${question_number}`; // Replace with your file path
    const encodedFile = encodeURIComponent(file);
    const uri = `obsidian://open?vault=${vault}&file=${encodedFile}`;
    // const uri = `obsidian://advanced-uri?vault=${vault}&filepath=${encodedFile}&commandid=obsidian-creases%3Afold-along-creases`;

    window.location.href = uri;
}

function showToast(toastTitle, toastMessage, toastTime) {
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

    document.getElementById('toastTitle').innerHTML = toastTitle
    document.getElementById('toastMessage').innerHTML = toastMessage
    document.getElementById('toastTime').innerHTML = toastTime

    toastBootstrap.show()


}

function loadHTMLQuestionsTable() {
    requestMatrixData().then(() => {
        calculateAllMetrics();

        htmlTable = document.getElementById('questionsTable');
        htmlTable.innerHTML = '';

        tableHead = document.createElement('thead');
        for (let i = 0; i < Object.keys(matrix[headersRow]).length; i++) {
            if (matrix[visibilityRow][Object.keys(matrix[headersRow])[i]] == 'TRUE') {
                const cellHeader = document.createElement('th');
                cellHeader.scope = 'col';
                cellHeader.classList.add('text-light', 'p-2', 'bg-success');

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
            commonTableRow = document.createElement('tr');
            // commonTableRow.className = 'opacity-25';

            for (let j = 0; j < Object.keys(matrix[headersRow]).length; j++) {
                let columnSetToVisible = matrix[visibilityRow][Object.keys(matrix[headersRow])[j]]

                if (columnSetToVisible == 'TRUE') {
                    let columnName = Object.keys(matrix[headersRow])[j]
                    let valueOnCsvTable = matrix[i][columnName];

                    const cellData = document.createElement('td');

                    if ((columnName === 'Input' || columnName === 'Output') && valueOnCsvTable) {
                        // valueOnCsvTable = valueOnCsvTable.replace(/\\\\/g, '\\');
                        valueOnCsvTable = valueOnCsvTable.replace(/\\n/g, '\\\\n');
                        katex.render(valueOnCsvTable, cellData);
                    } else {
                        cellData.textContent = valueOnCsvTable;
                    }

                    addStyletoCellDataElement(cellData, matrix[i]['#'], columnName);


                    if (columnName === 'Action buttons') {
                        addActionButtonsToCellData(cellData, i);
                    }

                    commonTableRow.appendChild(cellData);
                }
            }
            tableBody.appendChild(commonTableRow);
        }
        htmlTable.appendChild(tableBody);
    });
}

function loadHTMLQuestionsTableMini(metrics_name = "PMG-X") {
    requestMatrixData().then(() => {
        calculateAllMetrics();

        htmlTableMini = document.getElementById('questionsTableMini');

        const allKeys = Object.keys(matrix[headersRow]);
        const visibleKeys = allKeys.filter(key => matrix[visibilityRow][key] === 'TRUE');

        const th = document.getElementById('questionsTableMiniTh');
        th.colSpan = visibleKeys.length;
        // th.textContent = '[Metrics name here]';


        let numberOfQuestions = matrix.length - questionsStartRow;
        let numberOfColumns = 10;
        let numberOfRows = Math.ceil(numberOfQuestions / numberOfColumns);

        console.log('numberOfQuestions', numberOfQuestions);

        tableBody = document.getElementById('questionsTableMiniBody');
        tableBody.innerHTML = '';

        for (let i = 0; i < numberOfRows; i++) {
            let commonTableRow = document.createElement('tr');
            commonTableRow.classList.add('bg-success', 'w-100', 'p-2');

            for (let j = 0; j < numberOfColumns; j++) {
                let question_number = i * numberOfColumns + j + questionsStartRow;
                if (question_number < matrix.length) {
                    const cellData = document.createElement('td');
                    cellData.classList.add('p-2', 'text-center', 'align-middle');
                    // cellData.textContent = matrix[question_number]['#'];
                    cellData.innerHTML = 'q' + matrix[question_number]['#'] + '<br>' + matrix[question_number][metrics_name];

                    cellData.style.cursor = 'pointer';
                    cellData.style.border = '1px solid black';
                    cellData.title = matrix[toolTipsRow][Object.keys(matrix[headersRow])[0]].replace(/\\n/g, '\n');
                    // cellData.style.backgroundColor = getCellColor(matrix[question_number]['#'], metrics_name, false);
                    addStyletoCellDataElement(cellData, matrix[question_number]['#'], metrics_name);
                    cellData.onclick = function () {
                        openObsidianNote(matrix[question_number]['#']);
                    };
                    commonTableRow.appendChild(cellData);
                }
            }
            tableBody.appendChild(commonTableRow);
        }
        htmlTableMini.appendChild(tableBody);
    })
}

function addStyletoCellDataElement(cellDataElement, question_number, metric_name) {
    if (metric_name != 'DSLA' && metric_name != 'PMG-X') {
        return;
    }

    const specificQuestion = matrix.find(row => row['#'] === question_number);
    const specifiQuestionMetricValue = specificQuestion[metric_name];

    if (metric_name == 'PMG-X') {
        if (specifiQuestionMetricValue === Infinity) {
            cellDataElement.style.backgroundColor = 'purple';
            return;
        } else if (specifiQuestionMetricValue <= 1) {
            cellDataElement.style.backgroundColor = 'green';
            return;
        }
    }

    let allValuesFromMetric = matrix
        .filter(row => row[metric_name] !== undefined)
        .map(row => parseFloat(row[metric_name]))
        .filter(value => !isNaN(value) && value >= 0);

    if (metric_name == 'DSLA') {
        greatestIsGreen = false;
    } else if (metric_name == 'PMG-X') {
        greatestIsGreen = false;
        allValuesFromMetric = allValuesFromMetric.filter(value => value > 1).filter(value => value != Infinity);
        console.log(allValuesFromMetric);
    }

    const maxMetricsValue = Math.max(...allValuesFromMetric);
    const minMetricsValue = Math.min(...allValuesFromMetric);

    const normalizedPosition = 1 - (specifiQuestionMetricValue - minMetricsValue) / (maxMetricsValue - minMetricsValue);

    let red, green, blue = 0;

    if (greatestIsGreen) {
        if (normalizedPosition <= 0.5) {
            // First half: Red to Yellow (increase green)
            green = 255;
            red = Math.floor(255 * (normalizedPosition * 2));
        } else {
            // Second half: Yellow to Green (decrease red)
            green = Math.floor(255 * ((1 - normalizedPosition) * 2));
            red = 255;
        }
    }
    else {
        if (normalizedPosition <= 0.5) {
            // First half: Green to Yellow (decrease green)
            red = 255;
            green = Math.floor(255 * (normalizedPosition * 2));
        } else {
            // Second half: Yellow to Red (increase red)
            red = Math.floor(255 * ((1 - normalizedPosition) * 2));
            green = 255;
        }
    }

    cellDataElement.style.backgroundColor = `rgb(${red},${green},${blue})`;
    // return `rgb(${red},${green},${blue})`;
}

function addActionButtonsToCellData(cellData, i) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex justify-content-evenly align-items-center w-100 gap-2';

    const button0 = document.createElement('button');
    button0.className = 'btn btn-outline-warning';
    button0.textContent = '0';
    button0.onclick = function () {
        registerQuestionAttempt(matrix[i]['#'], 0);
    };
    buttonContainer.appendChild(button0);

    const button1 = document.createElement('button');
    button1.className = 'btn btn-outline-success';
    button1.textContent = '1';
    button1.onclick = function () {
        registerQuestionAttempt(matrix[i]['#'], 1);
    };
    buttonContainer.appendChild(button1);


    const questionNumber = matrix[i]['#'];
    const button2 = document.createElement('button');
    button2.className = 'btn btn-outline-primary';

    const logo = document.createElement('img');
    logo.src = 'libraries/Obsidian_logo.svg';        // path to your Obsidian logo
    logo.alt = 'Obsidian';
    logo.style.width = '16px';                    // adjust size as needed
    logo.style.height = '16px';
    logo.style.verticalAlign = 'middle';

    button2.appendChild(logo);

    logo.onclick = function () {
        openObsidianNote(questionNumber);
    };

    buttonContainer.appendChild(button2);

    cellData.appendChild(buttonContainer);
}

