/**
 * Queries related to the public.'BOT_USER_TABLE'
 */

import { Client } from 'pg';
import { BotUserInfo } from '../models/team';
import { getLatestResponseFromUser } from './user_responses';

export const getAllUsersFromDb = async (db: Client): Promise<BotUserInfo[]> => {
    try {
        const res = await db.query('SELECT * FROM public."BOT_USER_INFO";');

        // Individually get the latest response (hopefully) because I couldn't get a join to work
        for await (const user of res.rows as BotUserInfo[]) {
            const response = await getLatestResponseFromUser(db, user.id);
            user.latestResponse = response;
        }

        return res.rows as BotUserInfo[];
    } catch (err) {
        // Improve
        throw err;
    }
}

export const addSlackUserToDb = async (db: Client, slackId: string): Promise<BotUserInfo> => {
    try {
        const res = await db.query('INSERT INTO public."BOT_USER_INFO"(slack_id) VALUES($1) RETURNING *', [slackId]);
        return res.rows[0] as BotUserInfo;
    } catch (err) {
        throw err;
    }
}

export interface UpdateUserTeamSettingsOpts {
    teamName: string;
    role: 'lead'|'member';
    userId: string;
    perstat: boolean;
    report: boolean;
}

export const updateUserTeamSettings = async (db: Client, opts: UpdateUserTeamSettingsOpts): Promise<BotUserInfo> => {
    try {
        const res = await db.query(
            `UPDATE public."BOT_USER_INFO"
                SET assigned_team = $1,
                team_role = $2,
                perstat_required = $3,
                included_in_report = $4
            WHERE slack_id = $5
            RETURNING *`,
            [opts.teamName, opts.role, opts.perstat, opts.report, opts.userId]
        );
        return res.rows[0] as BotUserInfo;
    } catch (err) {
        throw err;
    }
}