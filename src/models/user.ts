import { Member } from "@slack/web-api/dist/response/UsersListResponse";


export interface BotUser extends Member {
    responded: boolean;
    responseTime: string;
}