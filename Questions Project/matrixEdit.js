function registerQuestionAttempt(questionNumber, code) {
    const question = matrix.find(row => row['#'] === questionNumber);
    const dateVector = question['Date Vector'];
    const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (dateVector.includes(today)) {
        alert('You have already attempted this question today.');
    } else {
        question['Date Vector'] = dateVector + ',' + today;
        question['Code Vector'] = question['Code Vector'] + ',' + code;

        saveMatrixLocally(matrix)
            .then(result => console.log('Save operation completed:', result))
            .catch(error => console.error('Save operation failed:', error));
        loadHTMLTable();
    }
}