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
            console.log('Processed matrix:', data.matrix);
            matrix = data.matrix;
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Check if server is running');
    }
}

async function requestToWriteMatrix() {
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