export interface VouchMultiSoldierSelectAction {
    selected_users: string[];
    type: VouchTypes.MultiSoldierSelect
}

export interface RemarksAction {
    value: string;
    type: VouchTypes.RemarksInput
}

export interface VouchActionFormatted {
    selected_users: string[];
    remarks: string;
    vouched_by: string;
}

export type VouchInputs = VouchMultiSoldierSelectAction | RemarksAction;

export enum VouchTypes {
    MultiSoldierSelect = 'multi_users_select',
    RemarksInput = 'plain_text_input'
}
