import { BotUser } from "./user";

export interface BotUserInfo {
    id: number;
    slack_id: string;
    assigned_team: string;
    team_role: 'lead'|'member';
    perstat_required: boolean;
    included_in_report: boolean;
    latestResponse?: UserResponse | null;
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

export interface Team {
    teamName: string;
    lead: BotUser | null;
    members: BotUser[];
}
export interface TeamReport {
    [key: string]: Team;
}