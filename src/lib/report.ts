import schedule from 'node-schedule';
import { getReportHour, getReportMin } from './utils';
import { getUsers } from './users';
import { reportBlocks } from './blocks';
import { DATE_RANGE } from './utils';
import { App } from '@slack/bolt';

export const sendReport = (app: App) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = getReportMin();
    rule.hour = getReportHour();
    rule.dayOfWeek = DATE_RANGE;

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

        app.client.chat.postMessage({
            channel: process.env.PERSTAT_CHANNEL_ID as string,
            blocks: reportBlocks(unaccountedForReport, presentReport),
            text: 'PERSTAT Rollup Available!'
        });
    });
};


// module.exports = {
//     sendReport
// };

