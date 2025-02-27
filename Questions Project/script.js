/* Matrix headers
0 question_number
1 discipline
2 source
3 description
4 code_vector
5 date_vector
6 days_since_last_attempt
*/

columnsVisibility =
    [
        question_number = true,
        discipline = true,
        source = true,
        description = true,
        code_vector = false,
        date_vector = false,
        days_since_last_attempt = true
    ]

function loadHTMLTable() {
    let htmlTable = document.getElementById('table')
    htmlTable.innerHTML = '';

    let tableHead = document.createElement('thead')
    let tableBody = document.createElement('tbody')

    for (let i = 0; i < matrix.length; i++) {
        let tableRow = document.createElement('tr')
        for (let j = 0; j < columnsVisibility.length; j++) {
            if (columnsVisibility[j]) {
                let tableData = document.createElement('td');
                tableData.textContent = matrix[i][j]
                tableRow.appendChild(tableData)

                // console.log(matrix[i][j])
            }
        }
        if (i == 0) {
            tableHead.appendChild(tableRow)
        } else {
            tableBody.appendChild(tableRow)
        }
    }
    htmlTable.appendChild(tableHead)
    htmlTable.appendChild(tableBody)
}

function calculateMetrics() {
    calculateNumberOfDaysSinceLastAttempt()
}

function calculateNumberOfDaysSinceLastAttempt() {
    matrix[0].push('days_since_last_attempt')

    for (let i = 1; i < matrix.length; i++) {
        // console.log(i)
        let dateStrings = matrix[i][5].replace(/[\[\]]/g, '').split(',')
        let lastDate = new Date(dateStrings[dateStrings.length - 1])
        let today = new Date()

        let timeDifferenceInMs = today - lastDate
        let timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24))

        matrix[i].push(timeDifferenceInDays)
    }
}

async function load() {
    response = await fetch('questions.csv')
    stringCSV = await response.text()
    matrix = stringCSV.split('\n').map(row => row.split('\t'))
    matrix.pop()

    calculateMetrics()
    loadHTMLTable()
}

load()
