import { App } from '@slack/bolt';
import { keyBy } from 'lodash';
import { Client } from 'pg';
import { updateUserTeamSettings } from '../database/bot_user_info';
import { markUserAsPresent, getUser, updateUser } from '../lib/users';
import { TIME_FORMAT_OPTS } from '../lib/utils';
import { BlockInputTypes } from '../models/blockInputs';
import { SetTeamActionFormatted, SetTeamActions, SetTeamMultiSoldierSelectAction, SetTeamName, SetTeamOptions, TeamOptions } from '../models/setTeam';
import { VouchActionFormatted, VouchInputs, VouchMultiSoldierSelectAction, RemarksAction } from '../models/vouch';

export const registerCommandActions = (app: App, db: Client) => {
    app.action('vouch-submit', async (action) => {
        await action.ack();

        const stateValues = action.body['state']?.values;
        const collectedInputs: VouchActionFormatted = {
            selected_users: [],
            remarks: '',
            vouched_by: action.body.user.id
        };
        let vouchedForResponseString = '';

        for (const value in stateValues) {
            // Yuck
            const input: VouchInputs = stateValues[value];
            const firstKey = Object.keys(input)[0];

            switch (input[firstKey].type) {
                case BlockInputTypes.UserSelect:
                    collectedInputs.selected_users = (input[firstKey] as VouchMultiSoldierSelectAction).selected_users;
                    collectedInputs.selected_users.forEach(user => vouchedForResponseString += `<@${user}> `);
                    break;

                case BlockInputTypes.TextInput:
                    collectedInputs.remarks = (input[firstKey] as RemarksAction).value;
                    break;
            }
        }

        await handleVouchInputs(db, collectedInputs);
        await action.respond({
            replace_original: true,
            text: `
=====================================================
<@${action.body.user.id}> HAS VOUCHED FOR:

Soldiers: ${vouchedForResponseString}
=====================================================
            `
        })
    });

    app.action('set-team-submit', async (action) => {
        await action.ack();

        const stateValues = action.body['state']?.values;
        const collectedInputs: SetTeamActionFormatted = {
            selected_team_lead: '',
            selected_users: [],
            team_name: '',
            perstat_required: true,
            included_in_report: true
        };
        let selectedUsersString = '';

        for (const value in stateValues) {
            // Yuck
            const input: VouchInputs = stateValues[value];
            const firstKey = Object.keys(input)[0];

            switch (firstKey) {
                case SetTeamActions.TeamLead:
                    collectedInputs.selected_team_lead = (input[firstKey] as SetTeamMultiSoldierSelectAction).selected_users[0];
                    break;

                case SetTeamActions.TeamMembers:
                    collectedInputs.selected_users = (input[firstKey] as SetTeamMultiSoldierSelectAction).selected_users;
                    collectedInputs.selected_users.forEach(user => selectedUsersString += `<@${user}> `);
                    break;

                case SetTeamActions.TeamName:
                    collectedInputs.team_name = (input[firstKey] as SetTeamName).value;
                    break;

                case SetTeamActions.CheckboxOptions:
                    const opts = (input[firstKey] as SetTeamOptions).selected_options;
                    const optsKeyed = keyBy(opts, 'value') as unknown as TeamOptions;

                    // TODO possibly make more semantically senseible
                    collectedInputs.perstat_required = !optsKeyed.perstat_required;
                    collectedInputs.included_in_report = !optsKeyed.included_in_report;

                    break;
            }
        }

        await handleSetTeamInput(collectedInputs, db);

        action.respond({
            replace_original: true,
            text: `
=====================================================
TEAM SETTINGS CHANGED:

Team: ${collectedInputs.team_name}
Lead: <@${collectedInputs.selected_team_lead}>
Members: ${selectedUsersString}
=====================================================
            `
        })
    });
}

export const handleVouchInputs = async (db: Client, input: VouchActionFormatted) => {
    for await (const user of input.selected_users) {
        markUserAsPresent(db, user, input.remarks, input.vouched_by);
        const vouchedUser = getUser(user);
        console.log(`Vouch Successful: ${vouchedUser?.real_name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}

export const handleSetTeamInput = async (input: SetTeamActionFormatted, db: Client) => {

    // Set team lead. Make it optional in case they screw up the input or if its a team without a lead identified
    if (input.selected_team_lead) {
        const updatedUser = await updateUserTeamSettings(db, {
            teamName: input.team_name,
            role: 'lead',
            userId: input.selected_team_lead,
            perstat: input.perstat_required,
            report: input.included_in_report
        } );
        updateUser(updatedUser);
    }

    // Set team members
    for await (const user of input.selected_users) {
        const updatedUser = await updateUserTeamSettings(db, {
            teamName: input.team_name,
            role: 'member',
            userId: user,
            perstat: input.perstat_required,
            report: input.included_in_report
        });
        updateUser(updatedUser);
    }
}
