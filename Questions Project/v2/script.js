/* Matrix headers
0 question_number
1 discipline
2 source
3 description
4 code_vector
5 date_vector
6 days_since_last_attempt
*/
let matrix = []

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

function addToolTipToElement(element, tooltipText) {
    element.className = "tooltip"

    let tooltip = document.createElement('span')
    tooltip.className = "tooltiptext"
    tooltip.innerHTML = tooltipText

    element.appendChild(tooltip)
}


function loadHTMLTable() {
    let htmlTable = document.getElementById('table')
    htmlTable.innerHTML = ''

    let tableHead = document.createElement('thead')
    let tableBody = document.createElement('tbody')

    for (let i = 0; i < matrix.length; i++) {
        let tableRow = document.createElement('tr')
        for (let j = 0; j < columnsVisibility.length; j++) {
            if (columnsVisibility[j]) {
                let tableData = document.createElement('td')
                tableData.textContent = matrix[i][j]
                tableRow.appendChild(tableData)

                // console.log(matrix[i][j])
            }
        }
        if (i == 0) {
            let tableData = document.createElement('td')
            tableData.textContent = "Actions"
            tableRow.appendChild(tableData)

            tableHead.appendChild(tableRow)
        } else {
            let buttonDiv = document.createElement('div')
            addToolTipToElement(buttonDiv, "0 = I did the question with help<br>1 = I did the question from memory only")

            let buttonHelp = document.createElement('button')
            buttonHelp.textContent = "0"
            buttonDiv.appendChild(buttonHelp)

            let buttonMemory = document.createElement('button')
            buttonMemory.textContent = "1"
            buttonDiv.appendChild(buttonMemory)

            tableRow.appendChild(buttonDiv)
            tableBody.appendChild(tableRow)
        }
    }
    htmlTable.appendChild(tableHead)
    htmlTable.appendChild(tableBody)
}

function calculateMetrics() {
    if (columnsVisibility[6]) {
        calculateNumberOfDaysSinceLastAttempt()
    }
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

async function loadCSV() {
    response = await fetch('questions.csv')
    stringCSV = await response.text()
    stringCSV = stringCSV.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    matrix = stringCSV.split('\n').map(row => row.split('\t'))
    matrix.pop()
}

async function load() {
    await loadCSV()
    calculateMetrics()
    loadHTMLTable()
    // saveCSV()
}

async function saveCSV() {
    const csvContent = matrix.map(row => row.slice(0, 6).join('\t')).join('\n')

    const response = await fetch('http://localhost:3000/save-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: csvContent
    })

    const result = await response.json()
    console.log(result.message)
}

load()
