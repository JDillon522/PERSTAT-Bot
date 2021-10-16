import { App } from "@slack/bolt";
import { commandResponse_reportBlocks, commandResponse_requestBlocks, commandResponse_vouchBlocks, commandResponse_setTeamBlocks, commandResponse_helpBlocks, commandResponse_defaultBlocks } from "../lib/blocks";
import { sendReport, sendPerstat } from "../perstat/perstat";
import { scheduleManualReport } from "../lib/scheduler";
import { getUser } from "../lib/users";
import { getFutureDate } from "../lib/utils";
import { PerstatCommands } from "../models/enums";
import { BotUser } from "../models/user";

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

            case PerstatCommands.setTeam:
                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_setTeamBlocks(user),
                    text: 'Identified users assigned to a team'
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
