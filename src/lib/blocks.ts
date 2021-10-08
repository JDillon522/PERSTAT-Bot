import { TIME_FORMAT_OPTS } from "./utils";

export const sendPerstatBlocks = [
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
];

export const sendReminderBlocks = [
    {
        type: "header",
        text: {
            type: "plain_text",
            text: "------- 186 CPT - PERSTAT - FINAL REMINDER -------"
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

const rollupHeader = `------- 186 CPT - PERSTAT Rollup for ${new Date().toLocaleString("en-US", TIME_FORMAT_OPTS)} -------`;
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
