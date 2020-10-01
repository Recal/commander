import EventModule from "../../module/EventModule";
import { Message } from "discord.js";
export default class MessageCreate extends EventModule {
    constructor();
    handle(data: Message): void;
}
