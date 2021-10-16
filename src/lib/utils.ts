import * as Scheduler from 'node-schedule';

const UTC_HOUR_DIFF = 4;
export const TIME_FORMAT_OPTS: Intl.DateTimeFormatOptions = {timeZone: 'America/New_York', /*dateStyle: 'medium',*/ timeStyle: 'medium', hour12: false};
export const DATE_RANGE = process.env.DISABLE_DAY_RANGE === 'true' ? [new Scheduler.Range(0, 7)] : [new Scheduler.Range(1, 5)]


export const _addUTC = () => {
    return process.env.ENVIRONMENT != "DEVELOPMENT" ? UTC_HOUR_DIFF : 0;
}

export const getInitialHour = () => {
    return parseInt(process.env.INITIAL_HOUR as string, 10) + _addUTC();
}

export const getInitialMin = () => {
    return parseInt(process.env.INITIAL_MIN as string, 10);
}

export const getReminderHour = () => {
    return parseInt(process.env.REMINDER_HOUR as string, 10) + _addUTC();
}

export const getReminderMin = () => {
    return parseInt(process.env.REMINDER_MIN as string, 10);
}

export const getReportHour = () => {
    return parseInt(process.env.REPORT_HOUR as string, 10) + _addUTC();
}

export const getReportMin = () => {
    return parseInt(process.env.REPORT_MIN as string, 10);
}

export const printStartupOutput = () => {
    const sol = new Date();
    const rem = new Date();
    const rep = new Date();
    sol.setHours(getInitialHour(), getInitialMin());
    rem.setHours(getReminderHour(), getReminderMin());
    rep.setHours(getReportHour(), getReportMin());

    console.log('=====================================================================');
    console.log(`PERSTAT BOT is Alive as of ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    console.log(`Running in mode: ${process.env.ENVIRONMENT}`)
    console.log(`\nBOT will execute at the following times:
    - Initial:      ${sol.toLocaleTimeString('en-US', {...TIME_FORMAT_OPTS, timeStyle: 'short' })}
    - Reminder:     ${rem.toLocaleTimeString('en-US', {...TIME_FORMAT_OPTS, timeStyle: 'short' })}
    - Report:       ${rep.toLocaleTimeString('en-US', {...TIME_FORMAT_OPTS, timeStyle: 'short' })}
    `);

    console.log(`Config Features:
    - Disable Date Range: ${process.env.DISABLE_DAY_RANGE === 'true'}
    - Send Requests To A Single User: ${process.env.SEND_ONLY_TO_USER ? process.env.SEND_ONLY_TO_USER : 'false'}
    - Disable Report: ${process.env.DISABLE_REPORT === 'true'}
    `);
    console.log('=====================================================================');
}

export const getFutureDate = (time: number): Date => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + time);
    return date;
}