const { TIME_FORMAT_OPTS } = require("./utils");

let _users = [];


const _getUsersFromSlack = async (app) => {
    console.log('Refreshing list of users');
    let users = await app.client.users.list();
    users = users.members.filter(user => !user.is_bot && !user.deleted && user.name != 'slackbot');

    return users;
};

const getUsers = async (app) => {
    if (!_users.length) {
        _users = await _getUsersFromSlack(app);
    }

    return _users;
};

const resetUserState = () => {
    _users = []; // TODO eventually incorporate with a DB
}

const markUserAsPresent = (userId) => {
    const userIndex = _users.findIndex(user => user.id === userId);

    if (userIndex >= 0) {
        _users[userIndex].responded = true;
        _users[userIndex].responseTime = new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS);
    }
};




module.exports = {
    getUsers,
    markUserAsPresent,
    resetUserState
};