const { TIME_FORMAT_OPTS } = require("./utils");

let _users = [];


const _getUsersFromSlack = async (app) => {
    console.log('Refreshing list of users');
    let users = await app.client.users.list();
    users = users.members.filter(user => !user.is_bot && !user.deleted && user.name != 'slackbot');

    // During local development if we only want to ping a single user
    if (process.env.SEND_ONLY_TO_USER) {
        users = users.filter(user => user.id === process.env.SEND_ONLY_TO_USER);
    }
    return users;
};

const getUsers = async (app) => {
    if (!_users.length) {
        _users = await _getUsersFromSlack(app);
    }

    return _users;
};

const getUser = (userId) => {
    const userIndex = _users.findIndex(user => user.id === userId);

    if (userIndex >= 0) {
        return _users[userIndex];
    }
    return null;
}

const resetUserState = () => {
    _users = []; // TODO eventually incorporate with a DB
}

const markUserAsPresent = (userId) => {
    const userIndex = _users.findIndex(user => user.id === userId);

    // TODO possibly use getUser() and change the user directly, but not sure if the reference value will persist
    // JS is weird
    if (userIndex >= 0) {
        _users[userIndex].responded = true;
        _users[userIndex].responseTime = new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS);
    }
};




module.exports = {
    getUser,
    getUsers,
    markUserAsPresent,
    resetUserState
};