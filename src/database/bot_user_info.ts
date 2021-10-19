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

export const updateUserTeamSettings = async (db: Client, teamName: string, role: 'lead'|'member', userId: string): Promise<BotUserInfo> => {
    try {
        const res = await db.query(
            'UPDATE public."BOT_USER_INFO" SET assigned_team = $1, team_role = $2 WHERE slack_id = $3 RETURNING *',
            [teamName, role, userId]
        );
        return res.rows[0] as BotUserInfo;
    } catch (err) {
        throw err;
    }
}