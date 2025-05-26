let questions = [];

window.addEventListener("DOMContentLoaded", () => {
    loadQuestions();
    reloadPage();
    showToast("Hello!", "Have a nice day!", ":)");
})

async function reloadPage() {
    await loadQuestions();
    // loadHTMLQuestionsTable();
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

    let numberOfColumns = 15;
    let numberOfQuestions = questions.length;
    console.log('Number of questions:', numberOfQuestions);
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
                    if (questions[question_number]['PMG-X'] <= 1) {
                        cellData.style.color = 'rgba(0, 0, 0, 0.2)'; // 20 %-opaque black
                    }
                }

                cellData.onclick = function () {
                    openObsidianNote(questions[question_number]['#']);
                };
                commonTableRow.appendChild(cellData);
            }
        }
        tableBody.appendChild(commonTableRow);
    }
    htmlTableMini.appendChild(tableBody);
}




const questionCreationform = document.getElementById('questionForm');

questionCreationform.addEventListener('submit', () => {
    const discipline = document.getElementById('discipline').value;
    const source = document.getElementById('source').value;
    const description = document.getElementById('description').value;

    postQuestion(discipline, source, description);
});

function postQuestion(discipline, source, description) {
    if (!discipline || !source || !description) {
        alert('All fields are required!');
        return;
    }

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






const attemptForm = document.getElementById('attemptForm');

attemptForm.addEventListener('submit', () => {
    const question_number = document.getElementById('questionNumber').value;
    const code = document.getElementById('code').value;

    postAttempt(question_number, code);
});

function postAttempt(question_number, code) {
    if (!question_number || !code) {
        alert('Both fields are required!');
        return;
    }

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
                alert(`Attempt recorded with ID: ${data.id}`);
            }
        })
        .catch(err => console.error('Error:', err));
}





function showToast(toastTitle, toastMessage, toastTime) {
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

    document.getElementById('toastTitle').innerHTML = toastTitle
    document.getElementById('toastMessage').innerHTML = toastMessage
    document.getElementById('toastTime').innerHTML = toastTime

    toastBootstrap.show()
}