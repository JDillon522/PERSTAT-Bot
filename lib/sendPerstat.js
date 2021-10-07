const schedule = require('node-schedule');
const { getUsers, resetUserState } = require('./users');
const { getInitialHour, getInitialMin, getReminderMin, getReminderHour } = require('./utils');
const { sendPerstatBlocks, sendReminderBlocks } = require('./blocks');

const sendPerstat = async (app) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getInitialMin();
    rule.hour = getInitialHour();
    rule.dayOfWeek = [new schedule.Range(1, 5)];

    const job = await schedule.scheduleJob(rule, async () => {
        console.log('---- Sending PERSTAT Solicitation ----');
        resetUserState();
        const users = await getUsers(app);

        users.forEach(user => {
            console.log(`Pinging: ${user.real_name}`);

            app.client.chat.postMessage({
                channel: user.id,
                blocks: sendPerstatBlocks,
                text: 'Time to submit your PERSTAT status'
            });
        });
    });
};


const sendReminder = (app) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getReminderMin();
    rule.hour = getReminderHour();
    rule.dayOfWeek = [new schedule.Range(1, 5)];

    const job = schedule.scheduleJob(rule, async () => {
        console.log('---- Sending PERSTAT REMINDERS ----');
        const users = await getUsers(app);

        users.forEach(user => {
            if (!user.responded) {

                console.log(`Sending Reminder Ping: ${user.name} / ${user.id}`);

                app.client.chat.postMessage({
                    channel: user.id,
                    blocks: sendReminderBlocks,
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