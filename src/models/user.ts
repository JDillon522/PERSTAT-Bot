import { Member } from "@slack/web-api/dist/response/UsersListResponse";
import { BotUserInfo } from "./team";


export interface BotUser extends Member {
    responded: boolean;
    responseTime: string;
    remarks?: string;
    vouchedBy?: string;
    vouchedOnDate: string;
    data?: BotUserInfo;
}
