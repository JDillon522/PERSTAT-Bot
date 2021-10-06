const UTC_HOUR_DIFF = 4;

getBaseHour = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.BASE_HOUR, 10) + UTC_HOUR_DIFF;
    } else {
        return parseInt(process.env.BASE_HOUR, 10);
    }
}

getBaseMin = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.BASE_MIN, 10);
    } else {
        return parseInt(process.env.BASE_MIN, 10);
    }
}

getReminderMinDelay = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.BASE_REMINDER_DELAY, 10);
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
        return parseInt(process.env.REPORT_MIN, 10);
    } else {
        return parseInt(process.env.REPORT_MIN, 10);
    }
}

module.exports = {
    getBaseHour,
    getBaseMin,
    getReminderMinDelay,
    getReportHour,
    getReportMin
}