const config = {
    obsidianVault: '1 Obsidian Vault',
    obsidianNotePath: 'CAL/questions-md/' // Use forward slashes for better compatibility
};

let questions = [];

window.addEventListener("DOMContentLoaded", () => {
    loadQuestions();
    reloadPage();    
})

async function reloadPage() {
    await loadQuestions();
    loadHTMLQuestionsTable();
    loadHTMLQuestionsTableMini();
}


const debugJSON = document.getElementById('debugJSON');

function loadQuestions() {
    return fetch('/api/questions')
        .then(res => res.json())
        .then(fetchedQuestions => {
            debugJSON.innerHTML = '';
            fetchedQuestions.forEach(item => {
                const pre = document.createElement('pre');
                pre.textContent = JSON.stringify(item, null, 2);
                debugJSON.appendChild(pre);
            });
            questions = fetchedQuestions;
            return fetchedQuestions;
        });
}


function loadHTMLQuestionsTableMini(metrics_name = "potential_memory_gain_multiplier") {
    htmlTableMini = document.getElementById('questionsTableMini');

    let numberOfColumns = 10;
    let numberOfQuestions = questions.length;
    let numberOfRows = Math.ceil(numberOfQuestions / numberOfColumns);

    const th = document.getElementById('questionsTableMiniTh');
    th.colSpan = numberOfColumns;

    tableBody = document.getElementById('questionsTableMiniBody');
    tableBody.innerHTML = '';

    for (let i = 0; i < numberOfRows; i++) {
        let commonTableRow = document.createElement('tr');
        commonTableRow.classList.add('w-100', 'p-2');

        for (let j = 0; j < numberOfColumns; j++) {
            let question_number = i * numberOfColumns + j;
            if (question_number < questions.length) {
                const cellData = document.createElement('td');
                cellData.classList.add('p-2', 'text-center', 'align-middle');
                // cellData.textContent = questions[question_number]['#'];
                cellData.innerHTML = 'q' + questions[question_number]['question_number'] + '<br>' + questions[question_number][metrics_name];

                cellData.style.cursor = 'pointer';
                cellData.style.border = '1px solid black';
                // cellData.title = questions[toolTipsRow][Object.keys(questions[headersRow])[0]].replace(/\\n/g, '\n');

                if (metrics_name == 'potential_memory_gain_multiplier') {
                    cellData.style.backgroundColor = `rgba(${questions[question_number]['PMG-X Cell Color']})`;
                    if (questions[question_number]['potential_memory_gain_multiplier'] <= 1) {
                        cellData.style.color = 'rgba(0, 0, 0, 0.2)'; // 20 %-opaque black
                    }
                }

                cellData.onclick = function () {
                    openObsidianNote(question_number + 1); // +1 because question_number is 0-indexed
                };
                commonTableRow.appendChild(cellData);
            }
        }
        tableBody.appendChild(commonTableRow);
    }
    htmlTableMini.appendChild(tableBody);
}



function loadHTMLQuestionsTable() {
    htmlTable = document.getElementById('questionsTable');
    htmlTable.innerHTML = '';

    let tableHeaders = [
        '#',
        'Discipline',
        'Source',
        'Description',
        'Attempts Summary',
        'DSLA',
        'LaMI',
        'PMG-D',
        'PMG-X',
        'Action buttons'
    ]

    tableHead = document.createElement('thead');
    for (let i = 0; i < tableHeaders.length; i++) {
        const cellHeader = document.createElement('th');
        cellHeader.scope = 'col';
        cellHeader.classList.add('text-light', 'p-2', 'bg-success', 'text-center', 'align-middle');

        cellHeader.textContent = tableHeaders[i];

        cellHeader.style.cursor = 'help';
        cellHeader.style.borderBottom = '1px dotted #888';

        tableHead.appendChild(cellHeader);
    }
    htmlTable.appendChild(tableHead);


    tableBody = document.createElement('tbody');
    for (let i = 0; i < questions.length; i++) {
        commonTableRow = document.createElement('tr');
        const columns = [
            'question_number',
            'discipline',
            'source',
            'description',
            'attempts_summary',
            'days_since_last_attempt',
            'latest_memory_interval',
            'potential_memory_gain_in_days',
            'potential_memory_gain_multiplier',
            // 'Action buttons' will be handled separately
        ];

        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = questions[i][col] !== undefined ? questions[i][col] : '';
            td.classList.add('align-middle');
            commonTableRow.appendChild(td);

            if (col == 'potential_memory_gain_multiplier') {
                td.style.backgroundColor = `rgba(${questions[i]['PMG-X Cell Color']})`;
                if (questions[i]['potential_memory_gain_multiplier'] <= 1) {
                    td.style.color = 'rgba(0, 0, 0, 0.2)'; // 20 %-opaque black
                }
            }
        });

        const actionTd = document.createElement('td');

        addActionButtonsToCellData(actionTd, questions[i]['question_number']);
        commonTableRow.appendChild(actionTd);

        tableBody.appendChild(commonTableRow);
    }
    htmlTable.appendChild(tableBody);
}










function postQuestion(discipline, source, description) {
    fetch('/api/questions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discipline, source, description })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(`Question created with ID: ${data.question_number}`);
                loadQuestions();
            }
        })
        .catch(err => console.error('Error:', err));
}


function postAttempt(question_number, code) {
    fetch('/api/questions/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_number, code })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(`Attempt recorded with ID: ${data.id}`);
                reloadPage();
            }
        })
        .catch(err => console.error('Error:', err));
}


function addActionButtonsToCellData(cellData, question_number) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex justify-content-evenly align-items-center w-100 gap-2';

    const button0 = document.createElement('button');
    button0.className = 'btn btn-outline-warning';
    button0.textContent = '0';
    button0.onclick = function () {
        postAttempt(question_number, 0);
    };
    buttonContainer.appendChild(button0);

    const button1 = document.createElement('button');
    button1.className = 'btn btn-outline-success';
    button1.textContent = '1';
    button1.onclick = function () {
        postAttempt(question_number, 1);
    };
    buttonContainer.appendChild(button1);

    const button2 = document.createElement('button');
    button2.className = 'btn btn-outline-primary';

    const logo = document.createElement('img');
    logo.src = 'Obsidian_logo.svg';        // path to your Obsidian logo
    logo.alt = 'Obsidian';
    logo.style.width = '16px';                    // adjust size as needed
    logo.style.height = '16px';
    logo.style.verticalAlign = 'middle';

    button2.appendChild(logo);

    button2.onclick = function () {
        openObsidianNote(question_number);
    };

    buttonContainer.appendChild(button2);

    cellData.appendChild(buttonContainer);
}

function openObsidianNote(question_number) {
    const vault = config.obsidianVault;
    const file = `${config.obsidianNotePath}q${question_number}`; // Build path dynamically

    const encodedFile = encodeURIComponent(file);
    const uri = `obsidian://open?vault=${vault}&file=${encodedFile}`;
    window.location.href = uri;
}


