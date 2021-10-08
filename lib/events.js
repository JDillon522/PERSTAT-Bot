const { markUserAsPresent, getUser } = require('./users');
const { TIME_FORMAT_OPTS } = require('./utils');

const registerClickEvents = (app) => {
    app.action('send_perstat', async ({ body, ack, say}) => {
        await respondToButton(app, body, ack, say);
    });

    app.action('send_perstat_final', async ({ body, ack, say}) => {
        await respondToButton(app, body, ack, say);
    })
}

const respondToButton = async (app, body, ack, say) => {
    // If there is a delay in the response from the client to the app then the client will resend the request (timeframe unknown)
    // This is to prevent double output on the client. We still need to make sure the submit ability is disabled after submission though
    if (!getUser(body.user.id).responded) {
        await ack();

        await say(`I'm glad to hear it <@${body.user.id}>.\n\nNow go forth and do great things.\n\n"I give a shit about you" - SFC Boyce`);

        markUserAsPresent(body.user.id);

        console.log(`Ping Successful: ${body.user.real_name || body.user.name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}


module.exports = {
    registerClickEvents
};