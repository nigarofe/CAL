const STATUS_SA = 'SA';
const STATUS_WH = 'W/H';
const STATUS_NA = 'NA';

const COLOR_SINGLE_ATTEMPT = '128, 128, 0, 1';
const COLOR_WITH_HELP = '128, 0, 128, 1';
const COLOR_NEVER_ATTEMPTED = '0, 0, 200, 1';
const COLOR_SOLID_GREEN = '0, 128, 0, 1';
const COLOR_DEGENERATE_GRAY = '128, 128, 128, 1';
const COLOR_FALLBACK_GRAY = '128, 128, 128, 1';

function calculateCellColor(records, metric_name = 'potential_memory_gain_multiplier') {
    const numericValues = records
        .map(r => parseFloat(r[metric_name]))
        .filter(v => !isNaN(v) && v >= 1);

    const maxVal = Math.max(...numericValues);
    const minVal = Math.min(...numericValues);
    const greatestIsGreen = false;


    records.forEach(r => {
        const v = r[metric_name];

        let colour;

        if (v === STATUS_SA) colour = COLOR_SINGLE_ATTEMPT;   // Single Attempt (no-help)
        else if (v === STATUS_WH) colour = COLOR_WITH_HELP;   // Last round With Help
        else if (v === STATUS_NA) colour = COLOR_NEVER_ATTEMPTED;     // Never attempted
        // Make this a UI responsive value
        else if (!isNaN(v) && v <= 1) colour = COLOR_SOLID_GREEN;        // gain ≤ 1 → solid green
        else if (!isNaN(v)) {
            // numeric and > 1  → gradient
            if (maxVal === minVal) {                 // degenerate case: all the same
                colour = COLOR_DEGENERATE_GRAY;
            } else {
                const normalized = 1 - (v - minVal) / (maxVal - minVal);   // 0-->high, 1-->low
                let red, green; const blue = 0;

                if (greatestIsGreen) {
                    if (normalized <= 0.5) {          // red → yellow
                        green = 255;
                        red = Math.floor(255 * (normalized * 2));
                    } else {                          // yellow → green
                        green = Math.floor(255 * ((1 - normalized) * 2));
                        red = 255;
                    }
                } else {
                    if (normalized <= 0.5) {          // green → yellow
                        red = 255;
                        green = Math.floor(255 * (normalized * 2));
                    } else {                          // yellow → red
                        red = Math.floor(255 * ((1 - normalized) * 2));
                        green = 255;
                    }
                }
                colour = `${red}, ${green}, ${blue}, 1`;
            }
        } else {
            colour = COLOR_FALLBACK_GRAY;              // fallback / corrupt value
        }

        r['PMG-X Cell Color'] = colour;               // attach to the current record
    });
}

module.exports = {
    STATUS_SA,
    STATUS_WH,
    STATUS_NA,
    COLOR_SINGLE_ATTEMPT,
    COLOR_WITH_HELP,
    COLOR_NEVER_ATTEMPTED,
    COLOR_SOLID_GREEN,
    COLOR_DEGENERATE_GRAY,
    COLOR_FALLBACK_GRAY,
    calculateCellColor
};
