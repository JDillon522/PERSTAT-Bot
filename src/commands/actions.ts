import { App } from "@slack/bolt";
import { VouchActionFormatted, VouchInputs, VouchTypes, VouchMultiSoldierSelectAction, RemarksAction } from "../models/vouch";
import { handleVouchInputs } from "./command";

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
                case VouchTypes.MultiSoldierSelect:
                    collectedInputs.selected_users = (input[firstKey] as VouchMultiSoldierSelectAction).selected_users;
                    break;

                case VouchTypes.RemarksInput:
                    collectedInputs.remarks = (input[firstKey] as RemarksAction).value;
                    break;
            }
        }

        handleVouchInputs(collectedInputs, app);
    });
}