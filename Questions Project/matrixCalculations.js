function calculateAllMetrics() {
    calculateNumberOfDaysSinceLastAttempt();
    calculateAttemptsSummary();
    calculateLoMIandLaMI();
}


function calculateNumberOfDaysSinceLastAttempt() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let dateStrings = matrix[i]['Date Vector'];

        if (dateStrings !== null) {
            dateStrings = dateStrings.replace(/[\[\]]/g, '').split(',');
            const lastDate = new Date(dateStrings[dateStrings.length - 1]);
            const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);

            const timeDifferenceInMs = today - lastDate;
            const timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));

            matrix[i]['DSLA'] = timeDifferenceInDays;
        } else {
            matrix[i]['DSLA'] = 'NA';
        }
    }
}

function calculateAttemptsSummary() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let totalAttempts = 0;
        let attemptsWithoutHelp = 0;
        let attemptsWithHelp = 0;
        let lastAttemptMessage = '';

        let codeVector = matrix[i]['Code Vector'];

        if (codeVector !== null) {
            codeVector += '';
            codeVector = codeVector.replace(/[\[\]]/g, '').split(',').map(Number);

            codeVector.forEach(code => {
                if (code == 1) {
                    attemptsWithoutHelp++;
                } else {
                    attemptsWithHelp++;
                }
                totalAttempts++;
            });

            if (codeVector[codeVector.length - 1] != 1) {
                lastAttemptMessage += 'W/H';
            } else {
                lastAttemptMessage += 'From memory';
            }
        }







        let summary = [totalAttempts, attemptsWithoutHelp, attemptsWithHelp, lastAttemptMessage].join('; ');

        matrix[i]['Attempts Summary'] = summary;
    }
}

function calculateLoMIandLaMI() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let memoryIntervals = [];

        let codeVector = matrix[i]['Code Vector'];
        if (codeVector !== null) {
            codeVector += '';

            codeVector = codeVector.replace(/[\[\]]/g, '').split(',').map(Number);
            let dateStrings = matrix[i]['Date Vector'].replace(/[\[\]]/g, '').split(',');

            // console.log('Code Vector:', codeVector);
            for (let j = 1; j < codeVector.length; j++) {
                if (codeVector[j] == 1) {
                    let timeDifferenceInMs = new Date(dateStrings[j]) - new Date(dateStrings[j - 1]);
                    let timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));
                    memoryIntervals.push(timeDifferenceInDays);
                }
            }

            if (memoryIntervals.length > 0) {
                const maxInterval = Math.max(...memoryIntervals);
                matrix[i]['LoMI'] = maxInterval;

                if (codeVector[codeVector.length - 1] == 1) {
                    matrix[i]['LaMI'] = memoryIntervals[memoryIntervals.length - 1];
                } else {
                    matrix[i]['LaMI'] = '0';
                }
            } else {
                matrix[i]['LoMI'] = '0'; // Default value if no intervals
                matrix[i]['LaMI'] = '0';
            }


            matrix[i]['PMG-D'] = matrix[i]['DSLA'] - matrix[i]['LaMI'];

            const pmgX = matrix[i]['DSLA'] / matrix[i]['LaMI'];
            matrix[i]['PMG-X'] = isFinite(pmgX) ? pmgX.toFixed(2) : pmgX;
        } else {
            matrix[i]['PMG-D'] = 'NA';
            matrix[i]['PMG-X'] = 'NA';
        }
    }
}