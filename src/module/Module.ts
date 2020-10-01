import { Message } from 'discord.js';

type CommandOptions = {
    name: string,
    level: number,
    group: string,
    aliases?: string[],
    owner: boolean   
}


export default abstract class CommandModule {
    private moduleOptions: CommandOptions | null = null;
    readonly _moduleOptions = this.moduleOptions;

    constructor(options: CommandOptions) {
        this.moduleOptions = options;
    }

    getOptions(): CommandOptions | null {
        return this.moduleOptions;
    }

    abstract run(msg: Message, args?: any[]): void
}