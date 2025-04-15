
const urlParams = new URLSearchParams(window.location.search);
const question_number = Number(urlParams.get('question_number'));
document.getElementById('question-title').textContent = `Question ${question_number}`;


let inputDiv = document.getElementById("input")
let outputDiv = document.getElementById("output")
let valueOnCsvTable = "c = \\pm\\sqrt{a^2 + b^2}";


window.addEventListener("DOMContentLoaded", () => {
    getMatrix().then(result => {
        matrix = result;

        valueOnCsvTable = matrix.find(row => row['#'] === question_number)['Input']
        valueOnCsvTable = valueOnCsvTable.replace(/\\n/g, '\\\\n');
        katex.render(valueOnCsvTable, inputDiv);

        valueOnCsvTable = matrix.find(row => row['#'] === question_number)['Output']
        valueOnCsvTable = valueOnCsvTable.replace(/\\n/g, '\\\\n');
        katex.render(valueOnCsvTable, outputDiv);
    })
});


