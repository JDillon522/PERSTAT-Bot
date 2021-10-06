const schedule = require('node-schedule');
const { getReportHour, getReportMin } = require('./utils');
const { getUsers } = require('./users');

sendReport = (app) => {
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

        const header = `------- 186 CPT - PERSTAT Rollup for ${new Date().toLocaleString("en-US")} -------`;
        app.client.chat.postMessage({
            channel: process.env.PERSTAT_CHANNEL_ID,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: header
                    }
                },
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `- Unaccounted For`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: unaccountedForReport.length ? unaccountedForReport : "- N/A"
                    }
                },
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `- Present`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: presentReport.length ? presentReport : "- N/A"
                    }
                },
                {
                    type: "divider"
                },
            ],
            text: 'PERSTAT Rollup Available!'
        });
    });
};


module.exports = {
    sendReport
};

