import Module from '../../module/Module';
import { Message } from 'discord.js';


export default class A extends Module {
    constructor() {
        super({
            name: "a",
            level: 0,
            group: "t",
            aliases: ['aa'],
            owner: true,
        })
    }

    run(msg: Message) {
        msg.channel.send("hi");
    }
}