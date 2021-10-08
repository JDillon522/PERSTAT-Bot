// Load local env credentials into process.env
import dotenv from 'dotenv';
dotenv.config();

import { App } from '@slack/bolt';
import { sendPerstat, sendReminder } from './lib/sendPerstat';
import { registerClickEvents } from './lib/events';
import { sendReport } from './lib/report';
import { printStartupOutput } from './lib/utils';
import { setUpErrorHandling } from './lib/errors';
import { getUsers } from './lib/users';


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_PERSTAT_BOT_SOCKET_TOKEN
});



(async () => {
    getUsers(app);
    setUpErrorHandling(app);
    registerClickEvents(app);
    sendPerstat(app);
    sendReminder(app);
    sendReport(app);

    await app.start(parseInt(process.env.PORT as string, 10) || 3000);

    printStartupOutput();
})();

