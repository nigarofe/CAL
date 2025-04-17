const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify/sync');
const path = require('path');
const http = require('http');

const DEFAULT_FOLDER_DIRECTORY = '../';
const DEFAULT_FILE_PATH = path.join(DEFAULT_FOLDER_DIRECTORY, 'questions.csv');

async function getCsvFileContent() {
    try {
        if (!fs.existsSync(DEFAULT_FILE_PATH)) {
            throw new Error(`File not found: ${DEFAULT_FILE_PATH}`);
        }

        const fileContent = fs.readFileSync(DEFAULT_FILE_PATH, 'utf8');
        const lines = fileContent.split('\n');

        let headers = [];
        if (lines.length > 0) {
            headers = lines[0].split('\t').map(header => header.trim());
        }

        const headerRow = {};
        headers.forEach(header => {
            headerRow[header] = header;
        });

        const matrix = [headerRow];

        await new Promise((resolve, reject) => {
            fs.createReadStream(DEFAULT_FILE_PATH)
                .pipe(csv({
                    separator: '\t'
                }))
                .on('data', (row) => {
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

        console.log("Matrix requested and delivered successfully");
        return matrix;
    } catch (error) {
        console.error('Error reading and processing matrix:', error);
        throw error;
    }
}

async function writeMatrixToCsv(matrix) {
    try {
        const columns = matrix.length > 0 ? Object.keys(matrix[0]) : [];

        const csvContent = stringify(matrix, {
            header: true,
            columns: columns,
            delimiter: '\t'
        });

        fs.writeFileSync(DEFAULT_FILE_PATH, csvContent);
        console.log(`Matrix successfully written to: ${DEFAULT_FILE_PATH}`);

        return { success: true, path: DEFAULT_FILE_PATH };
    } catch (error) {
        console.error('Error writing matrix to CSV:', error);
        throw error;
    }
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
            const matrix = await getCsvFileContent(DEFAULT_FILE_PATH);
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
                    const { matrix, DEFAULT_FILE_PATH, createBackup } = JSON.parse(body);
                    if (!matrix || !Array.isArray(matrix)) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Valid matrix array is required' }));
                        return;
                    }

                    const outputPath = DEFAULT_FILE_PATH || DEFAULT_FILE_PATH;
                    const result = await writeMatrixToCsv(matrix, outputPath, createBackup);

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Matrix API endpoints:`);
    console.log(`- GET /api/matrix?DEFAULT_FILE_PATH=./path/to/file.csv (default: ${DEFAULT_FILE_PATH})`);
    console.log(`- POST /api/matrix (with JSON body, default output: ${DEFAULT_FILE_PATH})`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = {
    getCsvFileContent,
    writeMatrixToCsv
};