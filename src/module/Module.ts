import { Message } from 'discord.js';

type CommandOptions = {
    name: string,
    level: number,
    group: string,
    aliases?: string[],
    owner: boolean,
    required_args_length?: number,
}


export default abstract class CommandModule {
    private moduleOptions: CommandOptions | null = null;

    constructor(options: CommandOptions) {
        this.moduleOptions = options;
    }

    getOptions(): Readonly<CommandOptions> | null {
        return this.moduleOptions ? this.moduleOptions : null;
    }

    abstract run(msg: Message, args?: unknown[]): void
}