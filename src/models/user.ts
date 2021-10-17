import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { SetUserInfo } from "./team";


export interface BotUser extends Member {
    responded: boolean;
    responseTime: string;
    remarks?: string;
    vouchedBy?: string;
    vouchedOnDate: string;
    data?: DbUser;
}

export interface DbUser extends SetUserInfo {
    id: number;
    slack_id: string;
}