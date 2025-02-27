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
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Set up middleware
app.use(express.text({ limit: '10mb' })); // For handling text/plain requests
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(cors()); // Enable CORS for all routes

// Handle POST requests to /save-csv
app.post('/save-csv', (req, res) => {
    try {
        const csvData = req.body;

        // Write the CSV data to a file
        const filePath = path.join(__dirname, 'questions_updated.csv');

        // Make sure the directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the file
        fs.writeFileSync(filePath, csvData, 'utf8');

        console.log('File saved successfully:', filePath);
        res.json({ success: true, message: 'File saved successfully' });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ success: false, message: 'Error saving file: ' + error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});