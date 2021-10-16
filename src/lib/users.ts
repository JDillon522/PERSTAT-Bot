import { App } from "@slack/bolt";
import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { BotUser } from "../models/user";
import { TIME_FORMAT_OPTS } from "./utils";

let _users: BotUser[] = [];


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

export const getUsers = async (app) => {
    if (!_users.length) {
        _users = await _getUsersFromSlack(app) as BotUser[];
    }

    return _users;
};

export const getUser = async (userId, app) => {
    if (!_users.length) {
        _users = await _getUsersFromSlack(app) as BotUser[];
    }
    const userIndex = _users.findIndex(user => user.id === userId);

    if (userIndex >= 0) {
        return _users[userIndex];
    }
    return null;
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
