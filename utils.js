const UTC_HOUR_DIFF = 4;

getBaseHour = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.BASE_HOUR, 10) + UTC_HOUR_DIFF;
    } else {
        return parseInt(process.env.BASE_HOUR, 10);
    }
}

getBaseMinute = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.BASE_MIN, 10) + UTC_HOUR_DIFF;
    } else {
        return parseInt(process.env.BASE_MIN, 10);
    }
}

getReminderDelay = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.BASE_REMINDER_DELAY, 10) + UTC_HOUR_DIFF;
    } else {
        return parseInt(process.env.BASE_REMINDER_DELAY, 10);
    }
}

getReportHour = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.REPORT_HOUR, 10) + UTC_HOUR_DIFF;
    } else {
        return parseInt(process.env.REPORT_HOUR, 10);
    }
}

getReportMin = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.REPORT_MIN, 10) + UTC_HOUR_DIFF;
    } else {
        return parseInt(process.env.REPORT_MIN, 10);
    }
}

module.exports = {
    getBaseHour,
    getBaseMinute,
    getReminderDelay,
    getReportHour,
    getReportMin
}