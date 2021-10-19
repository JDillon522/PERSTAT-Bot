import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { BotUserInfo } from './team';


export interface BotUser extends Member {
    data?: BotUserInfo;
}
