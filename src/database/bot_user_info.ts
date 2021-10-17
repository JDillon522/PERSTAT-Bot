/**
 * Queries related to the public.'BOT_USER_TABLE'
 */

import { Client } from "pg";
import { DbUser } from "../models/user";

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
//   client.query('INSERT into public."BOT_USER_INFO"(slack_id) VALUES($1)', ['U02GV2X7MUJ'], (err, res) => {
//       if (err) throw err;

//       console.log(res.rows);

//       client.end();
//   })