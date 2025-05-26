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

app.get('/api/questions', (req, res) => {
    const sql = `
    SELECT
      q.*,
      COALESCE(
        json_group_array(a.code        ORDER BY a.attempt_datetime),
        '[]'
      ) AS code_vec_json,
      COALESCE(
        json_group_array(a.attempt_datetime ORDER BY a.attempt_datetime),
        '[]'
      ) AS date_vec_json
    FROM questions AS q
    LEFT JOIN attempts AS a
      ON a.question_number = q.question_number
    GROUP BY q.question_number
    `;

    function applyPMG_XCellColor(records, metric_name = 'potential_memory_gain_multiplier') {
        // ... existing color assignment logic ...
    }

    db.all(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const enriched = rows.map(row => {
            const code_vector = JSON.parse(row.code_vec_json);
            const date_vector = JSON.parse(row.date_vec_json);

            // Days since last attempt
            const days_since_last_attempt = date_vector.length
                ? Math.floor(
                    (Date.now() - new Date(
                        new Date(date_vector[date_vector.length - 1])
                            .toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
                    ).getTime()) / (1000 * 60 * 60 * 24)
                )
                : null;

            // Memory intervals and PMG calculations
            let latest_memory_interval = 0;
            let potential_memory_gain_in_days = 'bug';
            let potential_memory_gain_multiplier = 'bug';

            if (!date_vector || date_vector.length === 0) {
                potential_memory_gain_multiplier = 'NA';
                potential_memory_gain_in_days = 'NA';
            } else {
                const memoryIntervals = [];
                for (let j = 1; j < code_vector.length; j++) {
                    if (code_vector[j] === 1) {
                        const prev = new Date(date_vector[j - 1]);
                        const curr = new Date(date_vector[j]);
                        memoryIntervals.push(
                            Math.floor((curr - prev) / (1000 * 60 * 60 * 24))
                        );
                    }
                }
                const lastCode = code_vector[code_vector.length - 1];
                latest_memory_interval = lastCode === 0 || memoryIntervals.length === 0
                    ? 0
                    : memoryIntervals[memoryIntervals.length - 1];

                potential_memory_gain_in_days =
                    days_since_last_attempt - latest_memory_interval;

                if (lastCode === 1 && code_vector.length === 1) {
                    potential_memory_gain_multiplier = 'SA';
                } else if (latest_memory_interval === 0) {
                    potential_memory_gain_multiplier = 'W/H';
                } else {
                    potential_memory_gain_multiplier = (
                        days_since_last_attempt / latest_memory_interval
                    ).toFixed(2);
                }
            }

            // Attempts summary (total; without help; with help; last attempt message)
            const totalAttempts = code_vector.length;
            const attemptsWithoutHelp = code_vector.filter(x => x === 1).length;
            const attemptsWithHelp = code_vector.filter(x => x === 0).length;
            let lastAttemptMessage;
            if (!code_vector || code_vector.length === 0) {
                lastAttemptMessage = 'NA';
            } else {
                lastAttemptMessage = code_vector[code_vector.length - 1] !== 1
                    ? 'W/H'
                    : 'From memory';
            }
            const attempts_summary = [
                totalAttempts,
                attemptsWithoutHelp,
                attemptsWithHelp,
                lastAttemptMessage
            ].join('; ');

            return {
                ...row,
                code_vector,
                date_vector,
                number_of_attempts: totalAttempts,
                number_of_attempts_with_help: attemptsWithHelp,
                number_of_attempts_without_help: attemptsWithoutHelp,
                days_since_last_attempt,
                latest_memory_interval,
                potential_memory_gain_in_days,
                potential_memory_gain_multiplier,
                attempts_summary
            };
        });

        // Assign PMG-X cell colours
        applyPMG_XCellColor(enriched, 'potential_memory_gain_multiplier');

        res.json(enriched);
    });
});


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