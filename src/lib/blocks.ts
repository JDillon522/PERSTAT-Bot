import { Block } from "@slack/types";
import { TIME_FORMAT_OPTS } from "./utils";
const env = process.env.ENVIRONMENT !== 'PRODUCTION' ? process.env.ENVIRONMENT : '';
const initialHeader = `------- 186 CPT - PERSTAT ------- ${env}`

export const sendPerstatBlocks = [
    {
        type: "header",
        text: {
            type: "plain_text",
            text: initialHeader
        }
    },
    {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "Good Morning!\n\nIts Time to submit your PERSTAT status.\nUntil further notice, also submit things on the Google Sheet. https://tinyurl.com/186perstat"
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
];

const reminderHeader = `------- 186 CPT - PERSTAT - FINAL REMINDER ------- ${env}`;
export const sendReminderBlocks = [
    {
        type: "header",
        text: {
            type: "plain_text",
            text: reminderHeader
        }
    },
    {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "Wake up! You haven't submitted your status yet\n\nThis is your last PERSTAT reminder before the report is sent"
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
                action_id: "send_perstat_final"
            }
        ]
    },
    {
        type: "divider"
    },
];

const rollupHeader = `------- 186 CPT - PERSTAT Rollup for ${new Date().toLocaleString("en-US", TIME_FORMAT_OPTS)} ------- ${env}`;
export const reportBlocks = (unaccountedForReport, presentReport) => {
    return [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: rollupHeader
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
                text: unaccountedForReport.length ? unaccountedForReport : "- N/A"
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
                text: presentReport.length ? presentReport : "- N/A"
            }
        },
        {
            type: "divider"
        },
    ]
}


export const commandResponse_reportBlocks = [
    {
        type: "header",
        text: {
            type: "plain_text",
            text: "---- PERSTAT Bot ----"
        }
    },
    {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "Manually building the report. Stand by..."
        }
    },
    {
        type: "divider"
    }
];

export const commandResponse_requestBlocks = (date: Date): Block[] => {
    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "---- PERSTAT Bot ----"
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Manually requesting another PERSTAT accountability"
            }
        },
        {
            type: "divider"
        }
    ];

    if (date) {
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `The report will be generated at ${date.toLocaleString("en-US", TIME_FORMAT_OPTS)}`
            }
        });
    }

    return blocks;
}

export const commandResponse_defaultBlocks = [
    {
        type: "header",
        text: {
            type: "plain_text",
            text: "---- PERSTAT Bot ----"
        }
    },
    {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "I didn't recognize your command. I'm just a bot.\n\nHave mercy...\n\nType `/perstat help`"
        }
    },
    {
        type: "divider"
    }
];

export const commandResponse_helpBlocks = [
    {
        type: "header",
        text: {
            type: "plain_text",
            text: "---- PERSTAT Bot ----"
        }
    },
    {
        type: "section",
        text: {
            type: "mrkdwn",
            text: `Syntax: \`/perstat <command> [argument]\`\n
            - \`/perstat help\` Show this list.
            - \`/perstat request [follow on report delay time]\` Trigger a new request. Optionally schedule a new report to run.
            - \`/perstat report\` Trigger a new PERSTAT report rollup.
            `
        }
    },
    {
        type: "divider"
    }
];