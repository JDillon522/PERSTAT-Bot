export interface BotUserInfo {
    id: number;
    slack_id: string;
    assignedTeam: string;
    teamRole: 'lead'|'member';
    perstatRequired: boolean;
    includedInReport: boolean;
    latestResponse: UserResponses
}

export interface UserResponses {
    id: number;
    bot_user_info_id: number;
    date_responded: Date;
    time_responded: string;
    date_good_until: Date;
    remarks: string;
}