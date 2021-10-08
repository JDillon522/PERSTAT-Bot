import { App, SlackActionMiddlewareArgs } from '@slack/bolt';
import { markUserAsPresent, getUser } from './users';
import { TIME_FORMAT_OPTS } from './utils';

export const registerClickEvents = (app: App) => {
    app.action('send_perstat', async ({ body, ack, say}) => {
        await respondToButton({body, ack, say} as SlackActionMiddlewareArgs);
    });

    app.action('send_perstat_final', async ({ body, ack, say}) => {
        await respondToButton({body, ack, say} as SlackActionMiddlewareArgs);
    })
}

export const respondToButton = async ({body, ack, say}: SlackActionMiddlewareArgs) => {
    // If there is a delay in the response from the client to the app then the client will resend the request (timeframe unknown)
    // This is to prevent double output on the client. We still need to make sure the submit ability is disabled after submission though
    const user = getUser(body.user.id);
    if (!user?.responded) {
        await ack();

        await say(`I'm glad to hear it <@${body.user.id}>.\n\nNow go forth and do great things.\n\n"I give a shit about you" - SFC Boyce`);

        markUserAsPresent(body.user.id);
        const name = body.user
        console.log(`Ping Successful: ${user?.real_name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}


// module.exports = {
//     registerClickEvents
// };