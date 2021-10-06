getUsers = async (app) => {
    console.log('Refreshing list of users');
    let users = await app.client.users.list();
    users = users.members.filter(user => !user.is_bot && user.name != 'slackbot');

    return users;
}

registerClickEvents = (app, users) => {
    app.action('send_perstat', async ({ body, ack, say}) => {
        await ack();

        await say(`I'm glad to hear it <@${body.user.id}>.\n\nNow go forth and do great things.\n\n"I give a shit about you" - SFC Boyce`);

        const userIndex = users.findIndex(user => user.id === body.user.id);

        if (userIndex > 0) {
            users[userIndex].responded = true;
        }

        console.log(`Ping Successful: ${body.user.name} / ${body.user.id}`);
    });
}

module.exports = {
    getUsers: getUsers,
    registerClickEvents: registerClickEvents
};