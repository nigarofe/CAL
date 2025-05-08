window.addEventListener("DOMContentLoaded", () => {
    reloadPage();
    showToast("Hello!", "Have a nice day!", ":)");
})

async function reloadPage() {
    await updateMatrixVariable();
    loadHTMLQuestionsTable();
    loadHTMLQuestionsTableMini()
}

document.querySelectorAll('input[name="metric"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const selectedLabel = document.querySelector(`label[for="${radio.id}"]`);
        selectedLabelTextContent = selectedLabel.textContent
        getUpdatedMatrix().then((matrix) => {
            loadHTMLQuestionsTableMini(matrix, selectedLabelTextContent);
        });
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
                columnName = matrix[headersRow][j]

                let valueOnCsvTable = matrix[i][columnName];

                const cellData = document.createElement('td');
                cellData.textContent = valueOnCsvTable;

                if (columnName == 'PMG-X') {
                    cellData.style.backgroundColor = `rgba(${matrix[i]['PMG-X Cell Color']})`;
                    if (matrix[i]['PMG-X'] <= 1) {
                        cellData.style.color = 'rgba(0, 0, 0, 0.2)'; // 20 %-opaque black
                    }
                }

                if (columnName === 'Action buttons') {
                    addActionButtonsToCellData(cellData, i);
                }

                commonTableRow.appendChild(cellData);
            }
        }
        tableBody.appendChild(commonTableRow);
    }
    htmlTable.appendChild(tableBody);
}

function loadHTMLQuestionsTableMini(metrics_name = "PMG-X") {
    htmlTableMini = document.getElementById('questionsTableMini');

    const allKeys = Object.keys(matrix[headersRow]);
    const visibleKeys = allKeys.filter(key => matrix[visibilityRow][key] === 'TRUE');

    const th = document.getElementById('questionsTableMiniTh');
    th.colSpan = visibleKeys.length;
    // th.textContent = '[Metrics name here]';


    let numberOfQuestions = matrix.length - questionsStartRow;
    let numberOfColumns = 10;
    let numberOfRows = Math.ceil(numberOfQuestions / numberOfColumns);

    tableBody = document.getElementById('questionsTableMiniBody');
    tableBody.innerHTML = '';

    for (let i = 0; i < numberOfRows; i++) {
        let commonTableRow = document.createElement('tr');
        commonTableRow.classList.add('w-100', 'p-2');

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

                if (metrics_name == 'PMG-X') {
                    cellData.style.backgroundColor = `rgba(${matrix[question_number]['PMG-X Cell Color']})`;
                    if (matrix[question_number]['PMG-X'] <= 1) {
                        cellData.style.color = 'rgba(0, 0, 0, 0.2)'; // 20 %-opaque black
                    }
                }

                cellData.onclick = function () {
                    openObsidianNote(matrix[question_number]['#']);
                };
                commonTableRow.appendChild(cellData);
            }
        }
        tableBody.appendChild(commonTableRow);
    }
    htmlTableMini.appendChild(tableBody);
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

    button2.onclick = function () {
        openObsidianNote(questionNumber);
    };

    buttonContainer.appendChild(button2);

    cellData.appendChild(buttonContainer);
}

function registerQuestionAttempt(question_number, code) {
    const questionRow = matrix.findIndex(row => row['#'] === question_number);
    const question = matrix[questionRow];

    let qdv = question['Date Vector'];
    let qcv = question['Code Vector'];

    console.log(`question_number = ${question_number}    code = ${code}    questionRow = ${questionRow}`);
    console.log(`question = ${question}`);
    console.log(`matrix[questionRow]['Date Vector'] = ${matrix[questionRow]['Date Vector']}`);
    console.log(`matrix[questionRow]['Code Vector'] = ${matrix[questionRow]['Code Vector']}`);

    const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (qdv == null || qdv == undefined || qdv == '') {
        // console.log('dateVector was null')
        qdv = today;
    } else if (qdv.includes(today)) {
        alert('You have already attempted this question today.');
        return;
    } else {
        qdv += ',' + today;
    }

    if (qcv == null || qcv == undefined || qcv == '') {
        // console.log('codeVector was null')
        qcv = code;
    } else {
        qcv += ',' + code;
    }

    matrix[questionRow]['Date Vector'] = qdv;
    matrix[questionRow]['Code Vector'] = qcv;

    requestToOverwriteCsv(matrixToRawCsv(matrix))
        .then(result => {
            console.log('Save operation completed:', result)
            if (code == 0) {
                showToast(`Done!`, `Question ${question_number} attempt registered successfully!<br>Code: ${code} <br> (I needed help to solve the question)`, today);
            } else {
                showToast(`Done!`, `Question ${question_number} attempt registered successfully!<br>Code: ${code} <br> (I solved the question without any external help)`, today);
            }

            console.log(`matrix[questionRow]['Date Vector'] = ${matrix[questionRow]['Date Vector']}`);
            console.log(`matrix[questionRow]['Code Vector'] = ${matrix[questionRow]['Code Vector']}`);
            reloadPage();
        }
        )
        .catch(error => {
            showToast('Error', 'Question attempt failled to save!', today);
            console.error('Save operation failed:', error)
        });
}