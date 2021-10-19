import { Client } from 'pg';
import { formatCurrentTime, TIME_FORMAT_OPTS } from '../lib/utils';
import { NewUserResponse, UserResponse } from '../models/team';

export const getLatestResponseFromUser = async (db: Client, botUserId: number): Promise<UserResponse> => {
    try {
        const res = await db.query(`
        SELECT
            bot_user_info_id,
            date_responded,
            date_good_until,
            remarks,
            vouched_by
        FROM public."USER_RESPONSES"
            where
                (bot_user_info_id = $1)
                and
                (
                    date_good_until::TIMESTAMP::DATE >= current_date
			        or date_responded::TIMESTAMP::DATE = current_date
                )
            order by
                date_responded asc,
                date_good_until asc

        fetch first 1 row only
	`, [botUserId]);
        return formatResponse(res.rows[0]) as UserResponse;
    } catch (err) {
        // Improve
        throw err;
    }
}

export const setResponse = async (db: Client, res: NewUserResponse): Promise<UserResponse> => {
    try {
        const response = await db.query(`
        INSERT INTO public."USER_RESPONSES"(
                bot_user_info_id, date_responded, date_good_until, remarks, vouched_by
            )
            VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
	`, [res.bot_user_info_id, res.date_responded, res.date_good_until, res.remarks, res.vouched_by]);
        return formatResponse(response.rows[0]) as UserResponse;
    } catch (err) {
        // Improve
        throw err;
    }
}

const formatResponse = (res: UserResponse): UserResponse => {
    const now = new Date().toDateString();
    const goodUntil = res?.date_good_until ? new Date(res?.date_good_until as string).toDateString() : null;
    const responded = res?.date_responded  ? new Date(res?.date_responded as string).toDateString()  : null;

    // If response is valid
    if (goodUntil && goodUntil >= now) {
        res.response_valid = true;
    }

    if (responded && responded >= now) {
        res.response_valid = true;
    }

    if (res?.date_responded) {
        res.time_responded = formatCurrentTime(res?.date_responded);
    }

    return res;
}