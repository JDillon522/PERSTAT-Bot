const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');

sendPerstat = (app) => {
    const channel = 'U06TTRZ97';

    const scheduler = new ToadScheduler();
    const task = new Task('Send PERSTAT Request', () => {
        app.client.chat.postMessage({
            channel: channel,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `Hey guy, wake up! <@${channel}>`
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
            text: 'Time to submit your PERSTAT status'
        });
    });

    const job = new SimpleIntervalJob({ seconds: 10 }, task);

    scheduler.addSimpleIntervalJob(job);



};

module.exports = sendPerstat;