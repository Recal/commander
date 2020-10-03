import Module from '../../module/Module';
import { Message } from 'discord.js';


export default class A extends Module {
    constructor() {
        super({
            name: "b",
            level: 0,
            group: "t",
            aliases: ['aa'],
            owner: false,
            is_guild_only: false
        })
    }

    run(msg: Message) {
        msg.channel.send("hi");
    }
}