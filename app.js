// Load local env credentials into process.env
require('dotenv').config();

const { App } = require('@slack/bolt');
const { sendPerstat, sendReminder } = require('./lib/sendPerstat.js');
const { registerClickEvents } = require('./lib/events.js');
const { sendReport } = require('./lib/report.js');
const { getInitialHour, getInitialMin, getReportHour, getReportMin, getReminderMin, getReminderHour } = require('./lib/utils.js');
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

    const sol = new Date();
    const rem = new Date();
    const rep = new Date();
    sol.setHours(getInitialHour(), getInitialMin());
    rem.setHours(getReminderHour(), getReminderMin());
    rep.setHours(getReportHour(), getReportMin());

    console.log('=====================================================================');
    console.log(`PERSTAT BOT is Alive as of ${new Date().toLocaleString('en-US', {timeZone: 'EST', dateStyle: 'medium', timeStyle: 'medium'})}`);
    console.log(`Running in mode: ${process.env.PRODUCTION ? 'PRODUCTION' : 'DEV'}`)
    console.log(`\nBOT will execute at the following times:\n
    - Solicitation: ${sol.toLocaleTimeString('en-US', { timeZone: 'EST', timeStyle: 'short' })}\n
    - Reminder:     ${rem.toLocaleTimeString('en-US', { timeZone: 'EST', timeStyle: 'short' })}\n
    - Report:       ${rep.toLocaleTimeString('en-US', { timeZone: 'EST', timeStyle: 'short' })}`);
    console.log('=====================================================================');
})();

