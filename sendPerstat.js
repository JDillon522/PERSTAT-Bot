const schedule = require('node-schedule');
const { getUsers } = require('./users');
const { getBaseHour, getBaseMinute, getReminderDelay } = require('./utils');

sendPerstat = async (app) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getBaseMinute();
    rule.hour = getBaseHour();
    rule.dayOfWeek = [new schedule.Range(1, 5)];

    const job = await schedule.scheduleJob(rule, async () => {
        console.log('---- Sending PERSTAT Solicitation ----');
        const users = await getUsers(app);

        users.forEach(user => {
            console.log(`Pinging: ${user.name} / ${user.id}`);

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


sendReminder = (app) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getBaseMinute() + getReminderDelay();
    rule.hour = getBaseHour();
    rule.dayOfWeek = [new schedule.Range(1, 5)];

    const job = schedule.scheduleJob(rule, async () => {
        console.log('---- Sending PERSTAT REMINDERS ----');
        const users = await getUsers(app);

        users.forEach(user => {
            if (!user.responded) {

                console.log(`Sending Reminder Ping: ${user.name} / ${user.id}`);

                app.client.chat.postMessage({
                    channel: user.id,
                    blocks: [
                        {
                            type: "header",
                            text: {
                                type: "plain_text",
                                text: "------- 186 CPT - PERSTAT - FINAL REMINDER -------"
                            }
                        },
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: "Wake up! You haven't submitted your status yet\n\nThis is your last PERSTAT reminder before the report is sent"
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
                                    action_id: "send_perstat_final"
                                }
                            ]
                        },
                        {
                            type: "divider"
                        },
                    ],
                    text: 'Last Reminder to submit your PERSTAT status!'
                });
            }
        });
    });
}



module.exports = {
    sendPerstat,
    sendReminder
};