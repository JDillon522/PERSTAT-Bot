getBaseHour = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.UTC_BASE_HOUR, 10);
    } else {
        return parseInt(process.env.DEV_BASE_HOUR, 10);
    }
}

getBaseMinute = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.UTC_BASE_MIN, 10);
    } else {
        return parseInt(process.env.DEV_BASE_MIN, 10);
    }
}

getReminderDelay = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.UTC_BASE_REMINDER_DELAY, 10);
    } else {
        return parseInt(process.env.DEV_BASE_REMINDER_DELAY, 10);
    }
}

getReportHour = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.UTC_REPORT_HOUR, 10);
    } else {
        return parseInt(process.env.DEV_REPORT_HOUR, 10);
    }
}

getReportMin = () => {
    if (process.env.PRODUCTION) {
        return parseInt(process.env.UTC_REPORT_MIN, 10);
    } else {
        return parseInt(process.env.DEV_REPORT_MIN, 10);
    }
}

module.exports = {
    getBaseHour,
    getBaseMinute,
    getReminderDelay,
    getReportHour,
    getReportMin
}