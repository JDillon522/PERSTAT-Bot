const schedule = require('node-schedule');

const UTC_HOUR_DIFF = 4;
const TIME_FORMAT_OPTS = {timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'medium'};
const DATE_RANGE = process.env.DISABLE_DAY_RANGE === 'true' ? [new schedule.Range(0, 7)] : [new schedule.Range(1, 5)]


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

const printStartupOutput = () => {
    const sol = new Date();
    const rem = new Date();
    const rep = new Date();
    sol.setHours(getInitialHour(), getInitialMin());
    rem.setHours(getReminderHour(), getReminderMin());
    rep.setHours(getReportHour(), getReportMin());

    console.log('=====================================================================');
    console.log(`PERSTAT BOT is Alive as of ${new Date().toLocaleString('en-US', TIME_FORMAT_OPTS)}`);
    console.log(`Running in mode: ${process.env.ENVIRONMENT}`)
    console.log(`\nBOT will execute at the following times:\n
    - Solicitation: ${sol.toLocaleTimeString('en-US', {...TIME_FORMAT_OPTS, timeStyle: 'short' })}
    - Reminder:     ${rem.toLocaleTimeString('en-US', {...TIME_FORMAT_OPTS, timeStyle: 'short' })}
    - Report:       ${rep.toLocaleTimeString('en-US', {...TIME_FORMAT_OPTS, timeStyle: 'short' })}
    `);

    console.log(`Config Features:
    - Disable Date Range: ${process.env.DISABLE_DAY_RANGE === 'true'}
    - Send Requests To A Single User: ${process.env.SEND_ONLY_TO_USER ? 'User: ' + process.env.SEND_ONLY_TO_USER : 'false'}
    - Disable Report: ${process.env.DISABLE_REPORT === 'true'}
    `);
    console.log('=====================================================================');
}

module.exports = {
    TIME_FORMAT_OPTS,
    DATE_RANGE,
    getInitialHour,
    getInitialMin,
    getReminderHour,
    getReminderMin,
    getReportHour,
    getReportMin,
    printStartupOutput
}