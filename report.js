const schedule = require('node-schedule');


sendReport = (app, users) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = [5, 20, 35, 50];

    const job = schedule.scheduleJob(rule, () => {
        console.log('Submitting PERSTAT Report');

        let presentReport = '';
        let unaccountedForReport = '';

        users.forEach(user => {
            if (user.responded) {
                presentReport += `- <@${user.id}>\n`;
            } else {
                unaccountedForReport += `- <@${user.id}>\n`;
            }

        });

        const header = `------- 186 CPT - PERSTAT Rollup for ${new Date().toLocaleString("en-US")} -------`;
        app.client.chat.postMessage({
            channel: 'C02GPM56D8D', // TODO: fix hardcoding
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
                    type: "divider"
                },
            ],
            text: 'PERSTAT Rollup Available!'
        });
    });
};


module.exports = {
    sendReport: sendReport
};

