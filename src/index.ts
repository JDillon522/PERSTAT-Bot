// Load local env credentials into process.env
import dotenv from 'dotenv';
dotenv.config();

import { App } from '@slack/bolt';
import { printStartupOutput } from './lib/utils';
import { setUpErrorHandling } from './lib/errors';
import { schedulePerstat, scheduleReminder, scheduleReport } from './lib/scheduler';
import { registerPerstatActions } from './perstat/actions';
import { registerCommands } from './commands/command';
import { registerCommandActions } from './commands/actions';
import { connectDatabase } from './database/connection';
import { loadUsers } from './lib/users';


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_PERSTAT_BOT_SOCKET_TOKEN
});



(async () => {
    // Connect to the Database
    const db = connectDatabase();
    loadUsers(db, app);

    // Errors
    setUpErrorHandling(app);

    // Handle interactivity
    registerPerstatActions(app, db);
    registerCommands(app);
    registerCommandActions(app, db);

    // Schedule
    schedulePerstat(app);
    scheduleReminder(app);
    scheduleReport(app);

    await app.start(parseInt(process.env.PORT as string, 10) || 3000);

    printStartupOutput();
})();

