// Load local env credentials into process.env
require('dotenv').config();

const { App } = require('@slack/bolt');
const { sendPerstat, sendReminder } = require('./sendPerstat.js');
const { registerClickEvents } = require('./events.js');
const { sendReport } = require('./report.js');


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_PERSTAT_BOT_SOCKET_TOKEN
});



(async () => {

    registerClickEvents(app);
    sendPerstat(app);
    sendReminder(app);
    sendReport(app);

    await app.start(process.env.PORT || 3000);

    console.log(`PERSTAT BOT is Alive as of ${new Date()}`);
    console.log(`Running in mode: ${process.env.PRODUCTION || 'DEV'}`)

})();

