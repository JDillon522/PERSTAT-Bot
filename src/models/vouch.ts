import { BlockInputTypes } from "./blockInputs";

export interface VouchMultiSoldierSelectAction {
    selected_users: string[];
    type: BlockInputTypes.UserSelect
}

export interface RemarksAction {
    value: string;
    type: BlockInputTypes.TextInput
}

export interface VouchActionFormatted {
    selected_users: string[];
    remarks: string;
    vouched_by: string;
}

export type VouchInputs = VouchMultiSoldierSelectAction | RemarksAction;
