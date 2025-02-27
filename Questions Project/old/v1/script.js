fetch('questions.csv')
    .then(response => response.text())
    .then(csvData => {
        const rows = csvData.trim().split('\n');
        const result = rows.map(row => row.split('\t'));

        // Get the header row
        const headers = result[0];

        // Load column visibility from localStorage
        let columnVisibility = JSON.parse(localStorage.getItem('columnVisibility')) || {};

        // If no visibility state in localStorage, initialize to true (visible)
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (columnVisibility[header] === undefined) {
                columnVisibility[header] = true;
            }
        }

        // Create column visibility controls
        const columnControls = document.getElementById('column-controls');

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `column-${i}`;
            checkbox.checked = columnVisibility[header]; // Set initial state from localStorage

            const label = document.createElement('label');
            label.htmlFor = `column-${i}`;
            label.textContent = header;

            columnControls.appendChild(checkbox);
            columnControls.appendChild(label);
            columnControls.appendChild(document.createElement('br'));

            checkbox.addEventListener('change', () => {
                columnVisibility[header] = checkbox.checked;
                localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility)); // Save to localStorage
                renderTable(result, columnVisibility); // Re-render the table
            });
        }

        // Function to render the table based on column visibility
        function renderTable(data, visibility) {
            // Clear the previous table
            const output = document.getElementById('output');
            output.innerHTML = '';

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Create header row
            const headerRow = document.createElement('tr');
            for (let i = 0; i < headers.length; i++) {
                const header = headers[i];
                if (visibility[header]) { // Only create header if column is visible
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                }
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create table body
            for (let i = 1; i < data.length; i++) {
                const tr = document.createElement('tr');
                for (let j = 0; j < data[i].length; j++) {
                    const header = headers[j];
                    if (visibility[header]) { // Only create cell if column is visible
                        const td = document.createElement('td');
                        td.textContent = data[i][j];
                        tr.appendChild(td);
                    }
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);

            output.appendChild(table);
        }

        // Initial render of the table
        renderTable(result, columnVisibility);

        console.log(result[1]);
        console.log(result);
    });