sendReport = (app, responses) => {
    setTimeout(() => {
        let report = '';

        responses.forEach(res => {
            report += `- <@${res}>\n`;
        });


        app.client.chat.postMessage({
            channel: 'C02GPM56D8D',
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `------- 186 CPT - PERSTAT Rollup for ${new Date().toLocaleString("en-US")} -------`
                    }
                },
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `- Present`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: report
                    }
                },
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `- Unaccounted For`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "- TBD"
                    }
                },
                {
                    type: "divider"
                },
            ],
            text: 'Time to submit your PERSTAT status'
        });
    }, 1000 * 30 * 1);
};


module.exports = {
    sendReport: sendReport
};

