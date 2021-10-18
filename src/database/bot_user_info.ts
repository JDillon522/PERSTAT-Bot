/**
 * Queries related to the public.'BOT_USER_TABLE'
 */

import { Client } from "pg";
import { BotUser, DbUser } from "../models/user";

export const getAllUsersFromDb = async (db: Client): Promise<DbUser[]> => {
    try {
        const res = await db.query('SELECT * FROM public."BOT_USER_INFO";');
        return res.rows as DbUser[];
    } catch (err) {
        // Improve
        throw err;
    }
}

export const addSlackUserToDb = async (db: Client, slackId: string): Promise<DbUser> => {
    try {
        const res = await db.query('INSERT INTO public."BOT_USER_INFO"(slack_id) VALUES($1) RETURNING *', [slackId]);
        return res.rows[0] as DbUser;
    } catch (err) {
        throw err;
    }
}

export const updateUserTeamSettings = async (db: Client, teamName: string, role: 'lead'|'member', userId: string): Promise<DbUser> => {
    try {
        const res = await db.query(
            'UPDATE public."BOT_USER_INFO" SET assigned_team = $1, team_role = $2 WHERE slack_id = $3 RETURNING *',
            [teamName, role, userId]
        );
        return res.rows[0] as DbUser;
    } catch (err) {
        throw err;
    }
}