import { App } from '@slack/bolt';
import { commandResponse_reportBlocks, commandResponse_requestBlocks, commandResponse_vouchBlocks, commandResponse_setTeamBlocks, commandResponse_helpBlocks, commandResponse_defaultBlocks, commandResponse_gtfoBlocks_default, commandResponse_gtfoBlocks_single } from '../lib/blocks';
import { sendReport, sendPerstat } from '../perstat/perstat';
import { scheduleManualReport } from '../lib/scheduler';
import { getUser, resetUserResponseStateForNewReport } from '../lib/users';
import { getFutureDate } from '../lib/utils';
import { PerstatCommands } from '../models/enums';
import { BotUser } from '../models/user';
import { Client } from 'pg';
import axios, { AxiosRequestConfig } from 'axios';

export const registerCommands = async (app: App, db: Client) => {
    app.command('/perstat', async ({ body, ack, say }) => {
        await ack();
        const args = body.text.split(' ');
        const user: BotUser = getUser(body.user_id) as BotUser;
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

                await resetUserResponseStateForNewReport(db, app, true);
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

    app.command('/gtfo', async({ body, ack, say }) => {
        await ack();
        const args = body.text.split(' ');
        const timerReqBody = {
            "skin_id":1,
            "name":"Countdown to DEMOB!",
            "time_end":'',
            "time_zone":"America\/New_York",
            "font_family":"Roboto-Bold",
            "color_primary":"FF3A43",
            "color_text":"333333",
            "color_bg":"FFFFFF",
            "transparent":"0",
            "lang_local":"0",
            "font_size":"45",
            "day":"1",
            "lang":"en",
            "expired_mes_on":"1",
            "expired_mes":"You should be at DEMOB",
            "labels":"1",
            "days":"days",
            "hours":"hours",
            "minutes":"minutes",
            "seconds":"seconds"
        }
        const timerUrl = 'https://countdownmail.com/api/create';
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: process.env.TIMER_API_KEY as string,
                'Content-Type': 'application/json'
            },
            data: timerReqBody
        };
        let cpt186Timer;
        let cpt183Timer;

        switch (args[0]) {
            case '186':
                config.data.time_end = process.env.DEMOB_DATE_186;
                cpt186Timer = await axios.get(timerUrl, config);

                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_gtfoBlocks_single('186', cpt186Timer.data.message.src),
                    text: 'Time to GTFO!'
                });
                break;

            case '183':
                config.data.time_end = process.env.DEMOB_DATE_183;
                cpt183Timer = await axios.get(timerUrl, config);

                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_gtfoBlocks_single('183', cpt183Timer.data.message.src),
                    text: 'Time to GTFO!'
                });
                break;

            default:
                config.data.time_end = process.env.DEMOB_DATE_186;
                cpt186Timer = await axios.get(timerUrl, config);

                config.data.time_end = process.env.DEMOB_DATE_183;
                cpt183Timer = await axios.get(timerUrl, config);

                await say({
                    channel: body.channel_id,
                    blocks: commandResponse_gtfoBlocks_default([cpt186Timer.data.message.src, cpt183Timer.data.message.src]),
                    text: 'Time to GTFO!'
                });
                break;
        }
    });
}
