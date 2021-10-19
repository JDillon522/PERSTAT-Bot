import { getUsers } from '../lib/users';
import { buildReportBlocks, reportBlocks, sendPerstatBlocks, sendReminderBlocks } from '../lib/blocks';
import { App } from '@slack/bolt';
import { sortBy } from 'lodash';
import { formatCurrentDate } from '../lib/utils';
import { TeamReport } from '../models/team';

export const sendPerstat = (app: App) => {
    console.log('---- Sending Initial PERSTAT Ping ----');
    const users = getUsers();

    users.forEach(user => {
        if (user.data?.perstat_required) {
            console.log(`Pinging: ${user.real_name}`);

            app.client.chat.postMessage({
                channel: user.id as string,
                blocks: sendPerstatBlocks,
                text: 'Time to submit your PERSTAT status'
            });
        } else {
            console.log(`Skipping - not included in perstat: ${user.real_name}`);
        }

    });
};


export const sendReminder = (app: App) => {

    console.log('---- Sending PERSTAT REMINDERS ----');
    const users = getUsers();

    users.forEach(user => {
        if (!user.data?.latestResponse?.response_valid) {

            console.log(`Sending Reminder Ping: ${user.real_name}`);

            app.client.chat.postMessage({
                channel: user.id as string,
                blocks: sendReminderBlocks,
                text: 'Last Reminder to submit your PERSTAT status!'
            });
        }
    });
}

export const sendReport = (app: App) => {
    const users = getUsers();
    let presentReport = '';
    let vouchedForReport = '';
    let unaccountedForReport = '';

    // Report by team
    const teamStatus: TeamReport = {};

    users.forEach(user => {
        const data = user.data;
        let team = teamStatus[data?.assigned_team as string];

        if (!team) {
            const teamName = data?.assigned_team ? data?.assigned_team as string : 'Unassigned';
            team = teamStatus[teamName] = {
                lead: null,
                members: [],
                teamName: teamName
            }
        }

        if (data?.team_role === 'lead') {
            team.lead = user;
        } else {
            team.members.push(user);
        }
    });


    // // Unaccounted for users
    // sortBy(users.filter(user => !user.data?.latestResponse?.response_valid), ['profile.last_name']).forEach(user => {
    //     unaccountedForReport += `- <@${user.id}>\n`;
    // });

    // // Users who responded
    // sortBy(users.filter(user => user.data?.latestResponse?.response_valid && !user.data?.latestResponse.vouched_by), ['profile.last_name']).forEach(user => {
    //     presentReport += `- <@${user.id}> at ${user.data?.latestResponse?.time_responded}` +
    //                     addRemarks(user.data?.latestResponse?.remarks as string);
    // });

    // // Users who were vouched for by someone else
    // sortBy(users.filter(user => user.data?.latestResponse?.response_valid && user.data?.latestResponse.vouched_by), ['profile.last_name']).forEach(user => {
    //     const vouchTime = formatCurrentDate(user.data?.latestResponse?.date_responded as string);
    //     vouchedForReport += `- <@${user.id}> was vouched for by <@${user.data?.latestResponse?.vouched_by}> at ${vouchTime}` +
    //                         addRemarks(user.data?.latestResponse?.remarks as string);
    // });

    console.log('Submitting PERSTAT Report');

    app.client.chat.postMessage({
        channel: process.env.PERSTAT_CHANNEL_ID as string,
        blocks: reportBlocks(buildReportBlocks(teamStatus)),
        text: 'PERSTAT Rollup Available!'
    });
};

const addRemarks = (remarks: string): string => {
    return `${remarks ? '\n\tRemarks: ' + remarks : ''}\n`
}