import { getUsers, resetUserState } from './users';
import { reportBlocks, sendPerstatBlocks, sendReminderBlocks } from './blocks';
import { App } from '@slack/bolt';

export const sendPerstat = async (app: App) => {
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
        channel: process.env.PERSTAT_CHANNEL_ID as string,
        blocks: reportBlocks(unaccountedForReport, presentReport),
        text: 'PERSTAT Rollup Available!'
    });
};