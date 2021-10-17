import { App, SlackActionMiddlewareArgs } from "@slack/bolt";
import { getUser, markUserAsPresent } from "../lib/users";
import { TIME_FORMAT_OPTS } from "../lib/utils";
import { RemarksAction } from "../models/vouch";

export const registerPerstatActions = (app: App) => {
    app.action('send_perstat', async ({ body, ack, respond}) => {
        await respondToPerstat(app, {body, ack, respond} as SlackActionMiddlewareArgs);
    });

    app.action('send_perstat_final', async ({ body, ack, respond}) => {
        await respondToPerstat(app, {body, ack, respond} as SlackActionMiddlewareArgs);
    });
}

export const respondToPerstat = async (app, {body, ack, respond}: SlackActionMiddlewareArgs) => {
    await ack();

    // If there is a delay in the response from the client to the app then the client will resend the request (timeframe unknown)
    // This is to prevent double output on the client.
    // Disabling the button on select is more difficult than I thought
    const user = getUser(body.user.id);
    if (!user?.responded) {
        await respond({
            replace_original: true,
            // Dont adjust the alignment of the string. Slack dumps it out weird
            text: `
=====================================================
I'm glad to hear it <@${body.user.id}>.
Now go forth and do great things.

'I give a shit about you' - SFC Boyce

Until further notice, also submit your status on the Google Sheet:
https://tinyurl.com/186perstat
=====================================================`

        });

        const values = body['state'].values;
        const remarks: RemarksAction = values[Object.keys(values)[0]]?.['perstat-remarks'];

        markUserAsPresent(body.user.id, remarks?.value);
        console.log(`Ping Successful: ${user?.real_name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}
