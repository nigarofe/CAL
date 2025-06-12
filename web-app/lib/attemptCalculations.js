/** @const {number} Milliseconds in a day. */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** @const {string} Status indicating an error. */
const STATUS_ERROR = 'ERROR';
/** @const {string} Status indicating data is not available. */
const STATUS_NA = 'NA';
/** @const {string} Status indicating a single attempt. */
const STATUS_SA = 'SA';
/** @const {string} Status indicating an attempt was made with help. */
const STATUS_WH = 'W/H';
/** @const {string} Status indicating an attempt was made from memory. */
const STATUS_FROM_MEMORY = 'From memory';

/**
 * Calculates the number of days since the last attempt.
 * @param {string[]} date_vector - An array of date strings for attempts.
 * @returns {number} The number of days since the last attempt.
 */
function calculateDaysSinceLastAttempt(date_vector) {
    // All calculations in GMT-0, hence the 'Z' in the date string
    const today = Date.now();
    const last_attempt_date = new Date(date_vector[date_vector.length - 1] + 'Z').getTime();

    let result = (today - last_attempt_date) / MS_PER_DAY;
    return Math.floor(result);
}

/**
 * Calculates the latest memory interval and potential gain in days.
 * @param {number[]} code_vector - Array of codes representing attempt success (1 for success, 0 for failure/help).
 * @param {string[]} date_vector - Array of date strings for each attempt.
 * @param {number} days_since_last_attempt - Number of days since the last attempt.
 * @returns {{latest_memory_interval: (string|number), potential_memory_gain_multiplier: (string|number), potential_memory_gain_in_days: (string|number)}}
 * Object containing latest memory interval, potential memory gain multiplier, and potential memory gain in days.
 * Values can be strings like 'SA' (Single Attempt) or 'W/H' (With Help) or numerical calculations.
 */
function calculateLatestMemoryIntervalAndPotentialGain(code_vector, date_vector, days_since_last_attempt) {
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

    // If it was a single attempt
    if ((lastCode === 1 && code_vector.length === 1)) {
        latest_memory_interval = STATUS_SA;
        potential_memory_gain_multiplier = STATUS_SA;
        potential_memory_gain_in_days = days_since_last_attempt
    } else
        // If the last attempt was with help
        if (memoryIntervals.length === 0 || lastCode === 0) {
            latest_memory_interval = STATUS_WH;
            potential_memory_gain_multiplier = STATUS_WH;
            potential_memory_gain_in_days = days_since_last_attempt;
        } else {
            // Calculate latest_memory_interval and potential_memory_gain_multiplier
            memoryIntervals[memoryIntervals.length - 1] === 0 ?
                latest_memory_interval = 1 : latest_memory_interval = memoryIntervals[memoryIntervals.length - 1];
            potential_memory_gain_multiplier = (
                days_since_last_attempt / latest_memory_interval
            ).toFixed(2);
            potential_memory_gain_in_days = days_since_last_attempt - latest_memory_interval;
        }

    return {
        latest_memory_interval,
        potential_memory_gain_multiplier,
        potential_memory_gain_in_days
    };
}

/**
 * Calculates a summary string of attempts.
 * @param {number[]} code_vector - Array of codes representing attempt success (1 for success, 0 for failure/help).
 * @returns {string} A summary string in the format "total_attempts; attempts_without_help; attempts_with_help; last_attempt_status".
 * Last attempt status can be 'NA', 'W/H', or 'From memory'.
 */
function calculateAttemptsSummary(code_vector) {
    attempts_without_help = code_vector.filter(x => x === 1).length;
    attempts_with_help = code_vector.filter(x => x === 0).length;
    total_attempts = attempts_without_help + attempts_with_help;

    let last_attempt_message;
    if (!code_vector || code_vector.length === 0) {
        last_attempt_message = STATUS_NA;
    } else {
        last_attempt_message = code_vector[code_vector.length - 1] !== 1
            ? STATUS_WH
            : STATUS_FROM_MEMORY;
    }
    attempts_summary = [
        total_attempts,
        attempts_without_help,
        attempts_with_help,
        last_attempt_message
    ].join('; ');

    return attempts_summary;
}

module.exports = {
    MS_PER_DAY,
    STATUS_ERROR,
    STATUS_NA,
    STATUS_SA,
    STATUS_WH,
    STATUS_FROM_MEMORY,
    calculateDaysSinceLastAttempt,
    calculateLatestMemoryIntervalAndPotentialGain,
    calculateAttemptsSummary
};
