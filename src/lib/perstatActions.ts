import { getUsers, resetUserState } from './users';
import { reportBlocks, sendPerstatBlocks, sendReminderBlocks } from './blocks';
import { App } from '@slack/bolt';
import { sortBy } from 'lodash';

export const sendPerstat = async (app: App) => {
    console.log('---- Sending Initial PERSTAT Ping ----');
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
};


export const sendReminder = async (app: App) => {

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
}

export const sendReport = async (app: App) => {
    const users = await getUsers(app);
    let presentReport = '';
    let unaccountedForReport = '';

    sortBy(users.filter(user => !user.responded), ['profile.last_name']).forEach(user => {
        unaccountedForReport += `- <@${user.id}>\n`;
    });

    sortBy(users.filter(user => user.responded), ['profile.last_name']).forEach(user => {
        presentReport += `- <@${user.id}> at ${user.responseTime}\n`;
    });

    console.log('Submitting PERSTAT Report');

    app.client.chat.postMessage({
        channel: process.env.PERSTAT_CHANNEL_ID as string,
        blocks: reportBlocks(unaccountedForReport, presentReport),
        text: 'PERSTAT Rollup Available!'
    });
};