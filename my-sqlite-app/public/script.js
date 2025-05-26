loadQuestions();

const questionsTable = document.getElementById('questionsTable');

function loadQuestions() {
    fetch('/api/questions')
        .then(res => res.json())
        .then(questions => {
            questionsTable.innerHTML = '';
            questions.forEach(item => {
                console.log(`Question JSON: ${JSON.stringify(item)}`);
                
                const li = document.createElement('li');
                li.textContent = item.description;
                questionsTable.appendChild(li);
            });
        });
}


const form = document.getElementById('questionForm');

form.addEventListener('submit', () => {
    const discipline = document.getElementById('discipline').value;
    const source = document.getElementById('source').value;
    const description = document.getElementById('description').value;

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
});