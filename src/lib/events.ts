import { App, SlackActionMiddlewareArgs } from '@slack/bolt';
import { PerstatCommands } from '../models/enums';
import { commandResponse_defaultBlocks, commandResponse_helpBlocks, commandResponse_reportBlocks, commandResponse_requestBlocks } from './blocks';
import { sendPerstat, sendReport } from './perstatActions';
import { scheduleManualReport } from './scheduler';
import { markUserAsPresent, getUser } from './users';
import { getFutureDate, TIME_FORMAT_OPTS } from './utils';

export const registerActions = (app: App) => {
    app.action('send_perstat', async ({ body, ack, say}) => {
        await respondToButton({body, ack, say} as SlackActionMiddlewareArgs);
    });

    app.action('send_perstat_final', async ({ body, ack, say}) => {
        await respondToButton({body, ack, say} as SlackActionMiddlewareArgs);
    });
}

export const registerCommands = (app: App) => {
    app.command('/perstat', async ({ body, ack, say }) => {
        await ack();
        const args = body.text.split(' ');

        switch (args[0]) {
            case PerstatCommands.report:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_reportBlocks,
                    text: "Manually building PERSTAT report"
                });

                sendReport(app);
                break;

            case PerstatCommands.request:
                let date;
                if (args[1] && parseInt(args[1], 10) > 0) {
                    date = getFutureDate(parseInt(args[1], 10));
                    scheduleManualReport(app, date);
                }

                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_requestBlocks(date),
                    text: "Manually triggering another PERSTAT request"
                });

                sendPerstat(app);
                break;

            case PerstatCommands.help:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_helpBlocks,
                    text: "PERSTAT Bot's Helping Hand"
                });

                break;
            default:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_defaultBlocks,
                    text: "PERSTAT Bot doesn't know what you're saying..."
                });
        }


    });
}

export const respondToButton = async ({body, ack, say}: SlackActionMiddlewareArgs) => {
    await ack();

    // If there is a delay in the response from the client to the app then the client will resend the request (timeframe unknown)
    // This is to prevent double output on the client. We still need to make sure the submit ability is disabled after submission though
    const user = getUser(body.user.id);
    if (!user?.responded) {
        await say(`I'm glad to hear it <@${body.user.id}>.\n\nNow go forth and do great things.\n\n"I give a shit about you" - SFC Boyce`);

        markUserAsPresent(body.user.id);
        console.log(`Ping Successful: ${user?.real_name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}

