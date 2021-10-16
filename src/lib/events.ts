import { App, SlackActionMiddlewareArgs } from '@slack/bolt';
import { PerstatCommands } from '../models/enums';
import { BotUser } from '../models/user';
import { VouchActionFormatted, VouchInputs, VouchMultiSoldierSelectAction, RemarksAction, VouchTypes } from '../models/vouch';
import { commandResponse_defaultBlocks, commandResponse_helpBlocks, commandResponse_reportBlocks, commandResponse_requestBlocks, commandResponse_vouchBlocks } from './blocks';
import { sendPerstat, sendReport } from './perstatActions';
import { scheduleManualReport } from './scheduler';
import { markUserAsPresent, getUser, getUsers } from './users';
import { getFutureDate, TIME_FORMAT_OPTS } from './utils';

export const registerActions = (app: App) => {
    app.action('send_perstat', async ({ body, ack, respond}) => {
        await respondToPerstat(app, {body, ack, respond} as SlackActionMiddlewareArgs);
    });

    app.action('send_perstat_final', async ({ body, ack, respond}) => {
        await respondToPerstat(app, {body, ack, respond} as SlackActionMiddlewareArgs);
    });

    app.action('vouch-submit', async (action) => {
        await action.ack();

        const stateValues = action.body['state']?.values;
        let collectedInputs: VouchActionFormatted = {
            selected_users: [],
            remarks: '',
            vouched_by: action.body.user.id
        };

        for (const value in stateValues) {
            // Yuck
            const input: VouchInputs = stateValues[value];
            const firstKey = Object.keys(input)[0];

            switch (input[firstKey].type) {
                case VouchTypes.MultiSoldierSelect:
                    collectedInputs.selected_users = (input[firstKey] as VouchMultiSoldierSelectAction).selected_users;
                    break;

                case VouchTypes.RemarksInput:
                    collectedInputs.remarks = (input[firstKey] as RemarksAction).value;
                    break;
            }
        }

        handleVouchInputs(collectedInputs, app);
    });
}

export const registerCommands = async (app: App) => {
    app.command('/perstat', async ({ body, ack, say }) => {
        await ack();
        const args = body.text.split(' ');
        const user: BotUser = await getUser(body.user_id, app) as BotUser;
        console.log(`Trying to execute the following /perstat command: ${body.text} from ${user.profile?.real_name}`);

        switch (args[0]) {
            case PerstatCommands.report:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_reportBlocks(user),
                    text: 'Manually building PERSTAT report'
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
                    blocks: commandResponse_requestBlocks(user, date),
                    text: 'Manually triggering another PERSTAT request'
                });

                sendPerstat(app);
                break;

            case PerstatCommands.vouch:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_vouchBlocks(user),
                    text: 'Vouch for another soldier who cannot submit'
                });

                break;

            case PerstatCommands.help:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_helpBlocks,
                    text: 'PERSTAT Bot\'s Helping Hand'
                });

                break;
            default:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_defaultBlocks(user),
                    text: 'PERSTAT Bot doesn\'t know what you\'re saying...'
                });
        }


    });
}

export const respondToPerstat = async (app, {body, ack, respond}: SlackActionMiddlewareArgs) => {
    await ack();

    // If there is a delay in the response from the client to the app then the client will resend the request (timeframe unknown)
    // This is to prevent double output on the client.
    // Disabling the button on select is more difficult than I thought
    const user = await getUser(body.user.id, app);
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

const handleVouchInputs = async (input: VouchActionFormatted, app) => {
    for await (const user of input.selected_users) {
        markUserAsPresent(user, input.remarks, input.vouched_by);
        const vouchedUser = await getUser(user, app);
        console.log(`Vouch Successful: ${vouchedUser?.real_name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}