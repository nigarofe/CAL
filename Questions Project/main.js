
let matrix;
headersRow = 0;
toolTipsRow = 1;
visibilityRow = 2;
questionsStartRow = 3;

// Example usage
/* getMatrix().then(result => {
    matrix = result;
    console.log(matrix);

    // Use the matrix data with writeProcessedMatrix
    if (matrix) {
        // Do some processing on the matrix if needed
        // ...

        // Save the processed matrix locally
        saveMatrixLocally(matrix)
            .then(result => console.log('Save operation completed:', result))
            .catch(error => console.error('Save operation failed:', error));
    }
}); */

async function getMatrix() {
    // console.log('async function getMatrix() at ', new Date().toLocaleString());
    try {
        const response = await fetch('http://localhost:3000/api/matrix');
        const data = await response.json();

        if (data.success) {
            console.log('Processed matrix:', data.matrix);
            return data.matrix;
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Check if server is running');
    }
}

/**
 * Sends a matrix to the server to be saved locally
 * @param {Array} matrix - The matrix to save
 * @param {string} filePath - Optional custom file path
 * @param {boolean} createBackup - Whether to create a backup of existing file (default: true)
 * @returns {Promise<object>} - Result object with success status and file path
 */
async function saveMatrixLocally(matrix, filePath = null, createBackup = false) {
    matrix.shift();
    try {
        const response = await fetch('http://localhost:3000/api/matrix', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matrix: matrix,
                filePath: filePath,
                createBackup: createBackup
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