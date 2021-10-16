import { BlockInputTypes } from "./blockInputs";

export interface SetTeamMultiSoldierSelectAction {
    selected_users: string[];
    type: BlockInputTypes.UserSelect
}

export enum SetTeamActions {
    TeamLead = 'team-lead-soldier-select',
    TeamMembers = 'team-member-soldier-select',
    TeamName = 'team-name'
}

export interface SetTeamName {
    value: string;
    type: BlockInputTypes.TextInput
}

export interface SetTeamActionFormatted {
    selected_team_lead: string;
    selected_users: string[];
    team_name: string;
}


