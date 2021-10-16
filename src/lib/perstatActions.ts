import { getUsers, resetUserState } from './users';
import { reportBlocks, sendPerstatBlocks, sendReminderBlocks } from './blocks';
import { App } from '@slack/bolt';
import { sortBy } from 'lodash';
import { RemarksAction } from '../models/vouch';

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
    let vouchedForReport = '';
    let unaccountedForReport = '';

    // Unaccounted for users
    sortBy(users.filter(user => !user.responded), ['profile.last_name']).forEach(user => {
        unaccountedForReport += `- <@${user.id}>\n`;
    });

    // Users who responded
    sortBy(users.filter(user => user.responded && !user.vouchedBy), ['profile.last_name']).forEach(user => {
        presentReport += `- <@${user.id}> at ${user.responseTime}` + addRemarks(user.remarks as string);
    });

    // Users who were vouched for by someone else
    sortBy(users.filter(user => user.responded && user.vouchedBy), ['profile.last_name']).forEach(user => {
        vouchedForReport += `- <@${user.id}> was vouched for by <@${user.vouchedBy}> at ${user.vouchedOnDate}` + addRemarks(user.remarks as string);
    });

    console.log('Submitting PERSTAT Report');

    app.client.chat.postMessage({
        channel: process.env.PERSTAT_CHANNEL_ID as string,
        blocks: reportBlocks(unaccountedForReport, vouchedForReport, presentReport),
        text: 'PERSTAT Rollup Available!'
    });
};

const addRemarks = (remarks: string): string => {
    return `${remarks ? '\n\tRemarks: ' + remarks : ''}\n`
}