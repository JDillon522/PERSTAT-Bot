const UTC_HOUR_DIFF = 4;
const TIME_FORMAT_OPTS = {timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'medium'};
const DATE_RANGE = process.env.DISABLE_DAY_RANGE ? [new schedule.Range(0, 7)] : [new schedule.Range(1, 5)]


const _addUTC = () => {
    return process.env.ENVIRONMENT != "DEVELOPMENT" ? UTC_HOUR_DIFF : 0;
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
    TIME_FORMAT_OPTS,
    DATE_RANGE,
    getInitialHour,
    getInitialMin,
    getReminderHour,
    getReminderMin,
    getReportHour,
    getReportMin
}