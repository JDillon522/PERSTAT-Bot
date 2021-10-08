const schedule = require('node-schedule');
import { getUsers, resetUserState } from './users';
import { getInitialHour, getInitialMin, getReminderMin, getReminderHour, DATE_RANGE } from './utils';
import { sendPerstatBlocks, sendReminderBlocks } from './blocks';
import { App } from '@slack/bolt';

export const sendPerstat = async (app: App) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getInitialMin();
    rule.hour = getInitialHour();
    rule.dayOfWeek = DATE_RANGE;

    const job = await schedule.scheduleJob(rule, async () => {
        console.log('---- Sending PERSTAT Solicitation ----');
        resetUserState();
        const users = await getUsers(app);

        users.forEach(user => {
            console.log(`Pinging: ${user.real_name}`);

            app.client.chat.postMessage({
                channel: user.id as string,
                blocks: sendPerstatBlocks,
                text: 'Time to submit your PERSTAT status'
            });
        });
    });
};


export const sendReminder = (app: App) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getReminderMin();
    rule.hour = getReminderHour();
    rule.dayOfWeek = DATE_RANGE;

    const job = schedule.scheduleJob(rule, async () => {
        console.log('---- Sending PERSTAT REMINDERS ----');
        const users = await getUsers(app);

        users.forEach(user => {
            if (!user.responded) {

                console.log(`Sending Reminder Ping: ${user.real_name}`);

                app.client.chat.postMessage({
                    channel: user.id as string,
                    blocks: sendReminderBlocks,
                    text: 'Last Reminder to submit your PERSTAT status!'
                });
            }
        });
    });
}



// module.exports = {
//     sendPerstat,
//     sendReminder
// };