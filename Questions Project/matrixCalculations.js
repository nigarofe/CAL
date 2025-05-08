function calculateNumberOfDaysSinceLastAttempt() {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        let dateStrings = matrix[i]['Date Vector'];

        if (dateStrings == null || dateStrings == undefined || dateStrings == '') {
            matrix[i]['DSLA'] = 'NA';
        } else {
            dateStrings = dateStrings.replace(/[\[\]]/g, '').split(',');
            const lastDate = new Date(dateStrings[dateStrings.length - 1]);
            const today = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);

            const timeDifferenceInMs = today - lastDate;
            const timeDifferenceInDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));

            matrix[i]['DSLA'] = timeDifferenceInDays;
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


        if (codeVector == null || codeVector == undefined || codeVector == '') {
            lastAttemptMessage = 'NA';
        } else {
            // console.log(`Question ${matrix[i]['#']}: ${codeVector}`);
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

        if (codeVector == '' || codeVector == null || codeVector == undefined) {
            // console.log('codeVector is empty')
            matrix[i]['PMG-D'] = 'NA';
            matrix[i]['PMG-X'] = 'NA';
        } else {
            let numberOfAttempts = codeVector.length;
            let lasAttemptCode = codeVector[numberOfAttempts - 1];

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


            if (lasAttemptCode == 1 && numberOfAttempts == 1) {
                matrix[i]['PMG-X'] = 'SA'; // Single Attempt
            } else if (matrix[i]['LaMI'] == 0) {
                matrix[i]['PMG-X'] = 'W/H'; // Last Attempt was With Help
            } else {
                const pmgX = matrix[i]['DSLA'] / matrix[i]['LaMI'];
                matrix[i]['PMG-X'] = pmgX.toFixed(2);
            }

        }
    }
}

function calculatePMG_XCellColor(metric_name = "PMG-X") {
    for (let i = questionsStartRow; i < matrix.length; i++) {
        const specificQuestion = matrix[i];
        const specifiQuestionMetricValue = specificQuestion[metric_name];

        if (specifiQuestionMetricValue === 'SA') {
            matrix[i]['PMG-X Cell Color'] = '128, 128, 0, 1';
        } else if (specifiQuestionMetricValue === 'W/H') {
            matrix[i]['PMG-X Cell Color'] = '128, 0, 128, 1';
        } else if (specifiQuestionMetricValue === 'NA') {
            matrix[i]['PMG-X Cell Color'] = '0, 0, 200, 1';
        } else if (specifiQuestionMetricValue <= 1) {
            matrix[i]['PMG-X Cell Color'] = '0, 128, 0, 1';    // matrix[i]['PMG-X Cell Color'] = 'd2'
        } else {
            let allValuesFromMetric = matrix
                .filter(row => row[metric_name] !== undefined)
                .map(row => parseFloat(row[metric_name]))
                .filter(value => !isNaN(value) && value >= 0);

            if (metric_name == 'PMG-X') {
                greatestIsGreen = false;
            }

            const maxMetricsValue = Math.max(...allValuesFromMetric);
            const minMetricsValue = Math.min(...allValuesFromMetric);

            if (maxMetricsValue == minMetricsValue) {
                cellDataElement.style.backgroundColor = 'gray';
            }

            const normalizedPosition = 1 - (specifiQuestionMetricValue - minMetricsValue) / (maxMetricsValue - minMetricsValue);

            let red, green, blue = 0;

            if (greatestIsGreen) {
                if (normalizedPosition <= 0.5) {
                    // First half: Red to Yellow (increase green)
                    green = 255;
                    red = Math.floor(255 * (normalizedPosition * 2));
                } else {
                    // Second half: Yellow to Green (decrease red)
                    green = Math.floor(255 * ((1 - normalizedPosition) * 2));
                    red = 255;
                }
            }
            else {
                if (normalizedPosition <= 0.5) {
                    // First half: Green to Yellow (decrease green)
                    red = 255;
                    green = Math.floor(255 * (normalizedPosition * 2));
                } else {
                    // Second half: Yellow to Red (increase red)
                    red = Math.floor(255 * ((1 - normalizedPosition) * 2));
                    green = 255;
                }
            }
            matrix[i]['PMG-X Cell Color'] = `${red}, ${green}, ${blue}, 1`;
        }
    }
}