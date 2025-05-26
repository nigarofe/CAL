loadQuestions();

const questionsTable = document.getElementById('questionsTable');

function loadQuestions() {
    fetch('/api/questions')
        .then(res => res.json())
        .then(questions => {
            questionsTable.innerHTML = '';
            questions.forEach(item => {
                const pre = document.createElement('pre');
                pre.textContent = JSON.stringify(item, null, 2);
                questionsTable.appendChild(pre);

                const li = document.createElement('li');
                li.textContent = item.description;
                questionsTable.appendChild(li);
            });
        });
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