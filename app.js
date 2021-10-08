// Load local env credentials into process.env
require('dotenv').config();

const { App } = require('@slack/bolt');
const { sendPerstat, sendReminder } = require('./lib/sendPerstat.js');
const { registerClickEvents } = require('./lib/events.js');
const { sendReport } = require('./lib/report.js');
const { printStartupOutput } = require('./lib/utils.js');
const { setUpErrorHandling } = require('./lib/errors.js');
const { getUsers } = require('./lib/users.js');


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

    await app.start(process.env.PORT || 3000);

    printStartupOutput();
})();

