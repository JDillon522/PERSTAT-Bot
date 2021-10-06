
sendPerstat = (app, users) => {

    setTimeout(() => {
        users.forEach(user => {
            app.client.chat.postMessage({
                channel: user,
                blocks: [
                    {
                        type: "divider"
                    },
                    {
                        type: "header",
                        text: {
                            type: "plain_text",
                            text: "------- 186 CPT - PERSTAT -------"
                        }
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "Good Morning!\n\nIts Time to submit your PERSTAT status"
                        }
                    },
                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    text: "I'm UP!"
                                },
                                action_id: "send_perstat"
                            }
                        ]
                    },
                    {
                        type: "divider"
                    },
                ],
                text: 'Time to submit your PERSTAT status'
            });
        });
    }, 30000);

};



module.exports = {
    sendPerstat: sendPerstat
};