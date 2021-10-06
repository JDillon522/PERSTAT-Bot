let _users = [];


_getUsersFromSlack = async (app) => {
    console.log('Refreshing list of users');
    let users = await app.client.users.list();
    users = users.members.filter(user => !user.is_bot && user.name != 'slackbot');

    return users;
},

getUsers = async (app) => {
    if (!_users.length) {
        _users = await _getUsersFromSlack(app);
    }

    return _users;
}

markUserAsPresent = (userId) => {
    const userIndex = _users.findIndex(user => user.id === userId);

    if (userIndex >= 0) {
        _users[userIndex].responded = true;
        _users[userIndex].responseTime = new Date();
    }
}




module.exports = {
    getUsers,
    markUserAsPresent
};