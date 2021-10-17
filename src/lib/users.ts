import { App } from "@slack/bolt";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { Client } from "pg";
import { addSlackUserToDb, getAllUsersFromDb } from "../database/bot_user_info";
import { BotUser, DbUser } from "../models/user";
import { TIME_FORMAT_OPTS } from "./utils";

let _users: BotUser[] = [];
let _dbUsers: DbUser[] = [];

const _getUsersFromSlack = async (app: App) => {
    console.log('Refreshing list of users');
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
    _dbUsers = await getAllUsersFromDb(db) as DbUser[];
    _users = await _getUsersFromSlack(app) as BotUser[];

    _normalizeDbUserDataWithSlack(db);
}

export const getUsers = (): BotUser[] => {
    return _users;
};

export const getUser = (userId): BotUser => {
    return _users.find(user => user.id === userId) as BotUser;
}

export const resetUserState = () => {
    _users = []; // TODO eventually incorporate with a DB
}

export const markUserAsPresent = (userId: string, remarks?: string, vouchedBy?: string) => {
    const userIndex = _users.findIndex(user => user.id === userId);

    // TODO possibly use getUser() and change the user directly, but not sure if the reference value will persist
    // JS is weird
    if (userIndex >= 0) {
        _users[userIndex].responded = true;
        _users[userIndex].responseTime = new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS);

        if (remarks) {
            _users[userIndex].remarks = remarks;
        }
        if(vouchedBy) {
            _users[userIndex].vouchedBy = vouchedBy;
            _users[userIndex].vouchedOnDate = new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS);
        }
    } else {
        console.error(`User Not Found: Could not mark as present user: ${userId}`);
    }

};
