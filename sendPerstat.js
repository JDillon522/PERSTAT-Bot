const schedule = require('node-schedule');


sendPerstat = (app, users) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = [0, 15, 30, 45];

    const job = schedule.scheduleJob(rule, () => {
        console.log('---- Starting PERSTAT Solicitation ----');

        users.forEach(user => {
            console.log(`Pinging: ${user.profile.display_name} / ${user.id}`);

            app.client.chat.postMessage({
                channel: user.id,
                blocks: [
                    {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "------- 186 CPT - PERSTAT -------"
                        }
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "Good Morning!\n\nIts Time to submit your PERSTAT status"
                        }
                    },
                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    text: "I'm UP!"
                                },
                                action_id: "send_perstat"
                            }
                        ]
                    },
                    {
                        type: "divider"
                    },
                ],
                text: 'Time to submit your PERSTAT status'
            });
        });
    });
};



module.exports = {
    sendPerstat: sendPerstat
};