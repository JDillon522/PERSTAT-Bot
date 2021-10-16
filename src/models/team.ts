export interface Team {
    name: string;
    lead: string;
    members: string[];
    ownRole: 'lead'|'member';
}

export interface SetUserInfo {
    assignedTeam: string;
    teamRole: 'lead'|'member';
    perstatRequired: boolean;
    includedInReport: boolean;
}
