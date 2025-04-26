let matrix;
headersRow = 0;
toolTipsRow = 1;
visibilityRow = 2;
questionsStartRow = 3;

requestMatrixData();

async function requestMatrixData() {
    try {
        const response = await fetch('http://localhost:3000/api/matrix');
        const data = await response.json();

        if (data.success) {
            matrix = data.matrix;
            console.log('Console.log(matrix) = ', matrix);
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Check if server is running');
    }
}

async function requestToOverwriteCsv() {
    matrix.shift();
    try {
        const response = await fetch('http://localhost:3000/api/matrix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matrix: matrix
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Matrix saved successfully at:', data.path);
            return data;
        } else {
            console.error('Error saving matrix:', data.error);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function registerQuestionAttempt(question_number, code) {
    const question = matrix.find(row => row['#'] === question_number);
    const dateVector = question['Date Vector'];
    console.log('dateVector and codeVector for question', question_number, 'before api request = \n', question['Date Vector'], '\n', question['Code Vector']);

    const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (dateVector.includes(today)) {
        alert('You have already attempted this question today.');
    } else {
        question['Date Vector'] = dateVector + ',' + today;
        question['Code Vector'] = question['Code Vector'] + ',' + code;

        requestToOverwriteCsv(matrix)
            .then(result => {
                console.log('Save operation completed:', result)
                if (code == 0) {
                    showToast(`Done!`, `Question ${question_number} attempt registered successfully!<br>Code: ${code} <br> (I needed help to solve the question)`, today);
                } else {
                    showToast(`Done!`, `Question ${question_number} attempt registered successfully!<br>Code: ${code} <br> (I solved the question without any external help)`, today);
                }
            }
            )
            .catch(error => {
                showToast('Error', 'Question attempt failled to save!', today);
                console.error('Save operation failed:', error)
            });
        loadHTMLTable();
    }
    console.log('dateVector and codeVector for question', question_number, 'after api request = \n', question['Date Vector'], '\n', question['Code Vector']);
}