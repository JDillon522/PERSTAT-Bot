import { App } from '@slack/bolt';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { Client } from 'pg';
import { addSlackUserToDb, getAllUsersFromDb } from '../database/bot_user_info';
import { setResponse } from '../database/user_responses';
import { BotUserInfo, NewUserResponse, UserResponse } from '../models/team';
import { BotUser } from '../models/user';

let _users: BotUser[] = [];
let _dbUsers: BotUserInfo[] = [];

const _getUsersFromSlack = async (app: App) => {
    const usersList = await app.client.users.list();
    let users: Member[] = usersList.members?.filter(user => !user.is_bot && !user.deleted && user.name != 'slackbot') || [];

    // During local development if we only want to ping a single user
    if (process.env.SEND_ONLY_TO_USER) {
        users = users.filter(user => user.id === process.env.SEND_ONLY_TO_USER);
    }
    return users;
};

const _normalizeDbUserDataWithSlack = async (db: Client): Promise<void> => {
    for await (const user of _users) {
        // if slack user is in db, tack db data onto slack user object
        let matchingDbUser = _dbUsers.find(dbUser => dbUser.slack_id === user.id);
        if (!matchingDbUser) {
            // if not in the db add it and then add it to the slack user
            matchingDbUser = await addSlackUserToDb(db, user.id as string);
        }

        user.data = matchingDbUser;
    }
}

export const loadUsers = async (db: Client, app: App): Promise<void> => {
    console.log('Refreshing list of users from Slack and the DB');

    _dbUsers = await getAllUsersFromDb(db) as BotUserInfo[];
    _users = await _getUsersFromSlack(app) as BotUser[];

    await _normalizeDbUserDataWithSlack(db);
    console.log('User normalization complete');

}

export const getUsers = (): BotUser[] => {
    return _users;
};

export const getUser = (userId): BotUser => {
    return _users.find(user => user.id === userId) as BotUser;
}

export const markUserAsPresent = async (db: Client, userId: string, remarks?: string, vouchedBy?: string) => {
    const userIndex = _users.findIndex(user => user.id === userId);

    // TODO possibly use getUser() and change the user directly, but not sure if the reference value will persist
    // JS is weird
    if (userIndex >= 0) {
        const response: NewUserResponse = {
            remarks: remarks as string | null,
            vouched_by: vouchedBy as string | null,
            date_responded: new Date().toUTCString(),
            date_good_until: null, // TODO
            bot_user_info_id: _users[userIndex].data?.id as number
        }
        const newResponse = await setResponse(db, response);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _users[userIndex].data!.latestResponse = newResponse as UserResponse;

    } else {
        console.error(`User Not Found: Could not mark as present user: ${userId}`);
    }
};

export const updateUser = (updatedUser: BotUserInfo): void => {
    if (!updatedUser) {
        // In case they accidentally select a bot or some inactivated user
        return;
    }
    const index = _users.findIndex(user => user.id === updatedUser.slack_id);

    // If for some insane reason we get out of sync and dont have the user
    try {
        _users[index].data = updatedUser;
    } catch (err) {
        throw err;
    }
}

export const resetUserResponseStateForNewReport = (): void => {
    _users.forEach(user => {
        const latestResponse = user.data?.latestResponse;
        const goodUntil = latestResponse?.date_good_until ? new Date(latestResponse?.date_good_until as string).toDateString() : null;

        if (!user.data?.perstat_required || !goodUntil || goodUntil < new Date().toDateString()) {
            return;
        }

        user.data.latestResponse = null;
    });
}