import EventModule from "../../module/EventModule"
import { Message } from "discord.js";


export default class MessageCreate extends EventModule {
    constructor() {
        super({
            event: 'message',
            customName: "MessageCreateEvent"
        })
    }

    handle(data: Message) {
        console.log("Message created: " + data.content);
    }
}