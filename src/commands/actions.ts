import { App } from "@slack/bolt";
import { markUserAsPresent, getUser } from "../lib/users";
import { TIME_FORMAT_OPTS } from "../lib/utils";
import { BlockInputTypes } from "../models/blockInputs";
import { SetTeamActionFormatted, SetTeamActions, SetTeamMultiSoldierSelectAction, SetTeamName } from "../models/setTeam";
import { SetUserInfo } from "../models/team";
import { VouchActionFormatted, VouchInputs, VouchMultiSoldierSelectAction, RemarksAction } from "../models/vouch";

export const registerCommandActions = (app: App) => {
    app.action('vouch-submit', async (action) => {
        await action.ack();

        const stateValues = action.body['state']?.values;
        let collectedInputs: VouchActionFormatted = {
            selected_users: [],
            remarks: '',
            vouched_by: action.body.user.id
        };

        for (const value in stateValues) {
            // Yuck
            const input: VouchInputs = stateValues[value];
            const firstKey = Object.keys(input)[0];

            switch (input[firstKey].type) {
                case BlockInputTypes.UserSelect:
                    collectedInputs.selected_users = (input[firstKey] as VouchMultiSoldierSelectAction).selected_users;
                    break;

                case BlockInputTypes.TextInput:
                    collectedInputs.remarks = (input[firstKey] as RemarksAction).value;
                    break;
            }
        }

        handleVouchInputs(collectedInputs, app);
    });

    app.action('set-team-submit', async (action) => {
        await action.ack();

        await action.respond({
            replace_original: true,
            text: '\n\nHold up there...\n\nThis is still under construction.'
        })
        // const stateValues = action.body['state']?.values;
        // let collectedInputs: SetTeamActionFormatted = {
        //     selected_team_lead: '',
        //     selected_users: [],
        //     team_name: ''
        // };

        // for (const value in stateValues) {
        //     // Yuck
        //     const input: VouchInputs = stateValues[value];
        //     const firstKey = Object.keys(input)[0];

        //     switch (firstKey) {
        //         case SetTeamActions.TeamLead:
        //             collectedInputs.selected_team_lead = (input[firstKey] as SetTeamMultiSoldierSelectAction).selected_users[0];
        //             break;

        //         case SetTeamActions.TeamMembers:
        //             collectedInputs.selected_users = (input[firstKey] as SetTeamMultiSoldierSelectAction).selected_users;
        //             break;

        //         case SetTeamActions.TeamName:
        //             collectedInputs.team_name = (input[firstKey] as SetTeamName).value;
        //             break;
        //     }
        // }

        // handleSetTeamInput(collectedInputs, app, action.body.token);
    });
}

export const handleVouchInputs = async (input: VouchActionFormatted, app: App) => {
    for await (const user of input.selected_users) {
        markUserAsPresent(user, input.remarks, input.vouched_by);
        const vouchedUser = await getUser(user, app);
        console.log(`Vouch Successful: ${vouchedUser?.real_name} at ${new Date().toLocaleTimeString('en-US', TIME_FORMAT_OPTS)}`);
    }
}

export const handleSetTeamInput = async (input: SetTeamActionFormatted, app: App, token: string) => {
    // Set team lead
    sendProfileUpdate(
        input.selected_team_lead,
        {
            assignedTeam: input.team_name,
            teamRole: 'lead',
            perstatRequired: true,
            includedInReport: true
        },
        app,
        token
    );
}

// TODO errors tend to be not_allowed_token_type and failed auth
const sendProfileUpdate = async (userId: string, input: SetUserInfo, app: App, token: string) => {
    await app.client.users.profile.set({
        // token: token,
        user: userId,
        // profile: JSON.stringify(input)
        name: 'team',
        value: input.assignedTeam
    });
}