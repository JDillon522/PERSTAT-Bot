getUsers = async (app) => {
    return await app.client.users.list();
}

registerClickEvents = (app, users) => {
    app.action('send_perstat', async ({ body, ack, say}) => {
        await ack();

        await say(`I'm glad to hear it <@${body.user.id}>.\n\nNow go forth and do great things.\n\n"I give a shit about you" - SFC Boyce`);

        const userIndex = users.findIndex(user => user.id === body.user.id);
        users[userIndex].responded = true;
    });
}

module.exports = {
    getUsers: getUsers,
    registerClickEvents: registerClickEvents
};