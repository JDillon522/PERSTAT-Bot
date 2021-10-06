registerClickEvents = (app, responses) => {
    app.action('send_perstat', async ({ body, ack, say}) => {
        await ack();

        await say(`I'm glad to hear it <@${body.user.id}>.\n\nNow go forth and do great things.\n\n"I give a shit about you" - SFC Boyce`);

        responses.push(body.user.id);
    });
}

module.exports = {
    registerClickEvents: registerClickEvents
};