import { BlockInputTypes } from './blockInputs';

export interface SetTeamMultiSoldierSelectAction {
    selected_users: string[];
    type: BlockInputTypes.UserSelect
}

export enum SetTeamActions {
    TeamLead = 'team-lead-soldier-select',
    TeamMembers = 'team-member-soldier-select',
    TeamName = 'team-name',
    CheckboxOptions = 'team-checkbox-options'
}

export interface SetTeamName {
    value: string;
    type: BlockInputTypes.TextInput
}

export interface SetTeamOptions {
    selected_options: { value: string }[];
    type: BlockInputTypes.Checkbox
}
export interface SetTeamActionFormatted {
    selected_team_lead: string;
    selected_users: string[];
    team_name: string;
    perstat_required: boolean;
    included_in_report: boolean;
}

export interface TeamOptions {
    perstat_required: unknown;
    included_in_report: unknown;
}

