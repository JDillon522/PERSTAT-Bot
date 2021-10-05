// Load local env credentials into process.env
require('dotenv').config();

const { App } = require('@slack/bolt');
const sendPerstat = require('./sendPerstat.js');


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_PERSTAT_BOT_SOCKET_TOKEN
});


app.message('hello', async ({message, say}) => {
    await say({
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Hey guy, wake up! <@${message.user}>`
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Submit'
                    },
                    action_id: 'button_click'
                }
            }
        ],
        text: `I guess I'm redundant <@${message.user}>`
    });
});

app.action('button_click', async ({ body, ack, say}) => {
    await ack();

    await say(`<@${body.user.id}> is awake`);
});


sendPerstat(app);

(async () => {
    await app.start(process.env.PORT || 3000);

    console.log('PERSTAT BOT is Alive!');

})();

