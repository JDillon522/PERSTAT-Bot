const schedule = require('node-schedule');
const { getReportHour, getReportMin } = require('./utils');
const { getUsers } = require('./users');
const { reportBlocks } = require('./blocks');

const sendReport = (app) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getReportMin();
    rule.hour = getReportHour();
    rule.dayOfWeek = [new schedule.Range(1, 5)];

    const job = schedule.scheduleJob(rule, async () => {
        const users = await getUsers(app);

        console.log('Submitting PERSTAT Report');

        let presentReport = '';
        let unaccountedForReport = '';

        users.forEach(user => {
            if (user.responded) {
                presentReport += `- <@${user.id}> at ${user.responseTime}\n`;
            } else {
                unaccountedForReport += `- <@${user.id}>\n`;
            }

        });

        app.client.chat.postMessage({
            channel: process.env.PERSTAT_CHANNEL_ID,
            blocks: reportBlocks(unaccountedForReport, presentReport),
            text: 'PERSTAT Rollup Available!'
        });
    });
};


module.exports = {
    sendReport
};

