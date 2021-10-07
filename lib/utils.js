const UTC_HOUR_DIFF = 4;

const _addUTC = () => {
    return process.env.PRODUCTION ? UTC_HOUR_DIFF : 0;
}

const getInitialHour = () => {
    return parseInt(process.env.INITIAL_HOUR, 10) + _addUTC();
}

const getInitialMin = () => {
    return parseInt(process.env.INITIAL_MIN, 10);
}

const getReminderHour = () => {
    return parseInt(process.env.REMINDER_HOUR, 10) + _addUTC();
}

const getReminderMin = () => {
    return parseInt(process.env.REMINDER_MIN, 10);
}

const getReportHour = () => {
    return parseInt(process.env.REPORT_HOUR, 10) + _addUTC();
}

const getReportMin = () => {
    return parseInt(process.env.REPORT_MIN, 10);
}

module.exports = {
    getInitialHour,
    getInitialMin,
    getReminderHour,
    getReminderMin,
    getReportHour,
    getReportMin
}