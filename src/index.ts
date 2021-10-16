// Load local env credentials into process.env
import dotenv from 'dotenv';
dotenv.config();

import { App } from '@slack/bolt';
import { printStartupOutput } from './lib/utils';
import { setUpErrorHandling } from './lib/errors';
import { schedulePerstat, scheduleReminder, scheduleReport } from './lib/scheduler';
import { registerPerstatActions } from './perstat/actions';
import { registerCommands } from './commands/command';


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_PERSTAT_BOT_SOCKET_TOKEN
});



(async () => {
    // Errors
    setUpErrorHandling(app);

    // Handle interactivity
    registerPerstatActions(app);
    registerCommands(app);

    // Schedule
    schedulePerstat(app);
    scheduleReminder(app);
    scheduleReport(app);

    await app.start(parseInt(process.env.PORT as string, 10) || 3000);

    printStartupOutput();
})();

