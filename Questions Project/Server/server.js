/* 
1. First, make sure you have Node.js installed on your system. You can check this by running
node -v
npm - v
 
2. Create a new directory for your project (if you haven't already) and navigate to it:
mkdir my-express-server
cd my-express-server

3. Initialize a new Node.js project:
npm init -y

4. Install the required dependencies:
npm install express fs path cors

5. Save the server code you provided into a file, for example, server.js

6. Run the server:
node server.js

7. If you want to automatically restart the server whenever you make changes to the code, you can install and use nodemon:
npm install -g nodemon
nodemon server.js
*/
const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify/sync');
const path = require('path');
const http = require('http');

// Define file path variables at the beginning of the code
const DEFAULT_DATA_DIRECTORY = '../';
// const DEFAULT_INPUT_FILE_PATH = path.join(DEFAULT_DATA_DIRECTORY, 'questions.csv');
const DEFAULT_INPUT_FILE_PATH = path.join(DEFAULT_DATA_DIRECTORY, 'processed-matrix.csv');
const DEFAULT_OUTPUT_FILE_PATH = path.join(DEFAULT_DATA_DIRECTORY, 'processed-matrix.csv');

/**
 * Reads a tab-delimited CSV file and returns the matrix after processing
 * @param {string} filePath - Path to the CSV file
 * @param {Function} processFunction - Function to process the matrix (optional)
 * @returns {Promise<Array>} - Processed matrix including header row
 */
async function getProcessedMatrix(filePath, processFunction = null) {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        // Read raw file content to get headers
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');

        // Extract headers from the first line
        let headers = [];
        if (lines.length > 0) {
            headers = lines[0].split('\t').map(header => header.trim());
        }

        // Create header row object
        const headerRow = {};
        headers.forEach(header => {
            headerRow[header] = header;
        });

        // Initialize matrix with header row as first element
        const matrix = [headerRow];

        // Read the CSV file and add data rows to matrix
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({
                    separator: '\t' // Set tab as delimiter
                }))
                .on('data', (row) => {
                    // Convert string values to numbers where possible
                    const processedRow = {};
                    Object.keys(row).forEach(key => {
                        const value = row[key];
                        processedRow[key] = isNaN(value) ? value : parseFloat(value);
                    });
                    matrix.push(processedRow);
                })
                .on('end', () => resolve())
                .on('error', (error) => reject(error));
        });

        // Apply custom processing function if provided
        if (processFunction && typeof processFunction === 'function') {
            return processFunction(matrix);
        }

        return matrix;
    } catch (error) {
        console.error('Error reading and processing matrix:', error);
        throw error;
    }
}

/**
 * Writes a processed matrix back to a tab-delimited CSV file
 * @param {Array} matrix - The matrix to write (including header row)
 * @param {string} filePath - Path to save the CSV file
 * @param {boolean} createBackup - Whether to create a backup of existing file (default: true)
 * @returns {Promise<object>} - Result object with success status and file path
 */
async function writeProcessedMatrix(matrix, filePath, createBackup = true) {
    try {
        // Create backup if file exists and backup option is enabled
        if (createBackup && fs.existsSync(filePath)) {
            const backupPath = `${filePath}.backup-${Date.now()}`;
            fs.copyFileSync(filePath, backupPath);
            console.log(`Backup created at: ${backupPath}`);
        }

        // Ensure directory exists
        const directory = path.dirname(filePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Get columns from the first row (header row)
        const columns = matrix.length > 0 ? Object.keys(matrix[0]) : [];

        // Convert matrix to CSV string with tab delimiter
        const csvContent = stringify(matrix, {
            header: true,
            columns: columns,
            delimiter: '\t' // Set tab as delimiter
        });

        // Write to file
        fs.writeFileSync(filePath, csvContent);
        console.log(`Matrix successfully written to: ${filePath}`);

        return { success: true, path: filePath };
    } catch (error) {
        console.error('Error writing matrix to CSV:', error);
        throw error;
    }
}

// Create an HTTP server to keep the process running
const server = http.createServer(async (req, res) => {
    // Add proper CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // GET endpoint to retrieve processed matrix
        if (req.method === 'GET' && pathname === '/api/matrix') {
            const filePath = url.searchParams.get('filePath') || DEFAULT_INPUT_FILE_PATH;
            const matrix = await getProcessedMatrix(filePath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, matrix }));
        }
        // POST endpoint to write processed matrix
        else if (req.method === 'POST' && pathname === '/api/matrix') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const { matrix, filePath, createBackup } = JSON.parse(body);
                    if (!matrix || !Array.isArray(matrix)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Valid matrix array is required' }));
                        return;
                    }

                    const outputPath = filePath || DEFAULT_OUTPUT_FILE_PATH;
                    const result = await writeProcessedMatrix(matrix, outputPath, createBackup);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Matrix successfully written',
                        path: result.path
                    }));
                } catch (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: error.message }));
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
    }
});

// Define port and start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Matrix API endpoints:`);
    console.log(`- GET /api/matrix?filePath=./path/to/file.csv (default: ${DEFAULT_INPUT_FILE_PATH})`);
    console.log(`- POST /api/matrix (with JSON body, default output: ${DEFAULT_OUTPUT_FILE_PATH})`);
});

// Add error handler to prevent crashes
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Handle process termination signals
process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Export functions for use in other modules
module.exports = {
    getProcessedMatrix,
    writeProcessedMatrix
};