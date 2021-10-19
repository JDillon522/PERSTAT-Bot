export interface BotUserInfo {
    id: number;
    slack_id: string;
    assignedTeam: string;
    teamRole: 'lead'|'member';
    perstatRequired: boolean;
    includedInReport: boolean;
    latestResponse?: UserResponse
}

export interface NewUserResponse {
    bot_user_info_id: number;
    date_responded: string;
    date_good_until: string | null;
    remarks: string | null;
    vouched_by: string | null;
}
export interface UserResponse extends NewUserResponse {
    id: number;
    response_valid: boolean;
    time_responded: string;
}