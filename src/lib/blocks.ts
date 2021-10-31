import { KnownBlock, PlainTextOption } from '@slack/types';
import _, { sortBy } from 'lodash';
import { SetTeamActions } from '../models/setTeam';
import { Team, TeamReport } from '../models/team';
import { BotUser } from '../models/user';
import { TIME_FORMAT_OPTS } from './utils';
const env = process.env.ENVIRONMENT !== 'PRODUCTION' ? process.env.ENVIRONMENT : '';
const initialHeader = `------- C Co. - PERSTAT ------- ${env}`

export const sendPerstatBlocks = [
    {
        type: 'header',
        text: {
            type: 'plain_text',
            text: initialHeader
        }
    },
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'Good Morning!\n\nIts Time to submit your PERSTAT status.\n'
        }
    },
    {
        type: 'input',
        element: {
            type: 'plain_text_input',
            action_id: 'perstat-remarks'
        },
        label: {
            type: 'plain_text',
            text: 'Optional Remarks',
        }
    },
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'I\'m UP!'
                },
                action_id: 'send_perstat'
            }
        ]
    },
    {
        type: 'divider'
    },
];

const reminderHeader = `------- C Co. - PERSTAT - FINAL REMINDER ------- ${env}`;
export const sendReminderBlocks = [
    {
        type: 'header',
        text: {
            type: 'plain_text',
            text: reminderHeader
        }
    },
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'Wake up! You haven\'t submitted your status yet\n\nThis is your last PERSTAT reminder before the report is sent'
        }
    },
    {
        type: 'actions',
        elements: [
            {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'I\'m UP!'
                },
                action_id: 'send_perstat_final'
            }
        ]
    },
    {
        type: 'divider'
    },
];

const rollupHeader = `------- C Co. - PERSTAT Rollup for ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)} ------- ${env}`;
export const reportBlocks = (builtReportBlocks: KnownBlock[]) => {
    builtReportBlocks.unshift({
        type: 'header',
        text: {
            type: 'plain_text',
            text: rollupHeader
        }
    })

    builtReportBlocks.push({
        type: 'divider'
    });

    return builtReportBlocks;
}

export const buildReportBlocks = (teamReport: TeamReport): KnownBlock[] => {
    let reportBlocks: KnownBlock[] = [];

    for (const teamKey in teamReport) {
        const team: Team = teamReport[teamKey];
        reportBlocks.push({
            type: 'header',
            text: {
                type: 'plain_text',
                text: team.teamName.toUpperCase()
            }
        });

        const unaccountedForTeamMembers: BotUser[] = team.members.filter(member =>
            !member.data?.latestResponse?.response_valid &&
            member.data?.included_in_report
        );
        const accountedForWithRemarks: BotUser[] = team.members.filter(member =>
            member.data?.latestResponse?.response_valid &&
            member.data?.latestResponse?.remarks &&
            !member.data?.latestResponse.vouched_by
        );
        const vouchedFor: BotUser[] = team.members.filter(member =>
            member.data?.latestResponse?.response_valid &&
            member.data?.latestResponse.vouched_by
        );
        // If the lead hasnt responded
        if (team.lead && !team.lead.data?.latestResponse?.response_valid) {
            unaccountedForTeamMembers.unshift(team.lead);
        }

        if (!unaccountedForTeamMembers.length) {
            reportBlocks.push(
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'All accounted for!'
                    }
                });

        } else {
            let report = 'Unaccounted for:\n';

            unaccountedForTeamMembers.forEach(user => {
                if (user.data?.team_role === 'lead') {
                    report += `- Team lead: <@${user.id}>\n`;
                } else {
                    report += `- <@${user.id}>\n`;
                }
            });
            reportBlocks.push(
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: report
                    }
                });
        }

        if (accountedForWithRemarks.length) {
            let report = 'Present with Remarks:\n';

            accountedForWithRemarks.forEach(user => {
                report += `- <@${user.id}>: \n---"${user.data?.latestResponse?.remarks}"\n`;
            });
            reportBlocks.push(
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: report
                    }
                });
        }

        if (vouchedFor.length) {
            let report = 'Vouched For:\n';

            vouchedFor.forEach(user => {
                report += `- <@${user.id}> vouched for by: <@${user.data?.latestResponse?.vouched_by}>\n`;

                if (user.data?.latestResponse?.remarks) {
                    report += `---"${user.data?.latestResponse?.remarks}"\n`;
                }

            });
            reportBlocks.push(
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: report
                    }
                });
        }
    }

    return reportBlocks;
}

export const commandResponse_reportBlocks = (requestingUser: BotUser): KnownBlock[] => {
    return [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: '---- PERSTAT Bot ----'
            }
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `<@${requestingUser.id}> is manually building the report. Stand by...`
            }
        },
        {
            type: 'divider'
        }
    ]
};

export const commandResponse_requestBlocks = (requestingUser: BotUser, date: Date): KnownBlock[] => {
    const blocks: KnownBlock[] = [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: '---- PERSTAT Bot ----'
            }
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `<@${requestingUser.id}> is manually requesting another PERSTAT accountability`
            }
        },
        {
            type: 'divider'
        }
    ];

    if (date) {
        blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `The report will be generated at ${date.toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`
            }
        });
    }

    return blocks;
}

export const commandResponse_defaultBlocks = (requestingUser: BotUser): KnownBlock[] => {
    return [
        {
            type: 'header',
            text: {
                type: 'plain_text',
                text: '---- PERSTAT Bot ----'
            }
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `I didn't recognize your command <@${requestingUser.id}>. I'm just a bot.\n\nHave mercy...\n\nType \`/perstat help\``
            }
        },
        {
            type: 'divider'
        }
    ];
};

export const commandResponse_helpBlocks: KnownBlock[] = [
    {
        type: 'header',
        text: {
            type: 'plain_text',
            text: '---- PERSTAT Bot ----'
        }
    },
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `Syntax: \`/perstat <command> [argument]\`\n
            - \`/perstat help\` Show this list.
            - \`/perstat request [follow on report delay time]\` Trigger a new request. This will clear the previous request state.
                    Optionally schedule a new report to run.
            - \`/perstat report\` Trigger a new PERSTAT report rollup.
            - \`/perstat vouch\` Vouch for a person who is unavailable
            - \`/perstat set-team\` Set a team lead, its members, and wether or not they are reported on the PERSTAT
            `
        }
    },
    {
        type: 'divider'
    }
];

export const commandResponse_vouchBlocks = (requestingUser: BotUser): KnownBlock[] => {

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `<@${requestingUser.id}> is vouching for a soldier.\nSelect who you are vouching for:`
            }
        },
        {
			type: 'input',
			element: {
				type: 'multi_users_select',
				placeholder: {
					type: 'plain_text',
					text: 'Select Soldiers',
				},
				action_id: 'vouch-multi-soldier-select'
			},
			label: {
				type: 'plain_text',
				text: 'Vouch for the following Soldiers',
			}
		},
        {
            type: 'input',
            element: {
                type: 'plain_text_input',
                action_id: 'vouch-remarks'
            },
            label: {
                type: 'plain_text',
                text: 'Remarks',
            }
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Submit',
                    },
                    action_id: 'vouch-submit'
                }
            ]
        }
    ];
}

export const commandResponse_setTeamBlocks = (requestingUser: BotUser): KnownBlock[] => {

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `<@${requestingUser.id}> is setting the team members under a soldier.`
            }
        },
        {
			type: 'input',
			element: {
				type: 'multi_users_select',
				placeholder: {
					type: 'plain_text',
					text: 'Select Only ONE Team Lead',
				},
				action_id: SetTeamActions.TeamLead
			},
			label: {
				type: 'plain_text',
				text: 'Team Lead',
			}
		},
        {
			type: 'input',
			element: {
				type: 'multi_users_select',
				placeholder: {
					type: 'plain_text',
					text: 'Select One or More Members',
				},
				action_id: SetTeamActions.TeamMembers
			},
			label: {
				type: 'plain_text',
				text: 'Team Members',
			}
		},
        {
            type: 'input',
            element: {
                type: 'plain_text_input',
                action_id: SetTeamActions.TeamName
            },
            label: {
                type: 'plain_text',
                text: 'Team Name',
            }
        },
        {
			type: 'input',
			element: {
				type: 'checkboxes',
				options: [
					{
						text: {
							type: 'plain_text',
							text: 'Not required to submit a daily PERSTAT',
						},
						value: 'perstat_required'
					},
                    {
						text: {
							type: 'plain_text',
							text: 'Not included in PERSTAT report',
						},
						value: 'included_in_report'
					}
				],
				action_id: SetTeamActions.CheckboxOptions
			},
			label: {
				type: 'plain_text',
				text: 'Options',
			}
		},
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Submit',
                    },
                    action_id: 'set-team-submit'
                }
            ]
        }
    ];
}