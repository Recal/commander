import { Message } from 'discord.js';
declare type CommandOptions = {
    name: string;
    level: number;
    group: string;
    aliases?: string[];
    owner: boolean;
};
export default abstract class CommandModule {
    private moduleOptions;
    readonly _moduleOptions: CommandOptions | null;
    constructor(options: CommandOptions);
    getOptions(): CommandOptions | null;
    abstract run(msg: Message, args?: any[]): void;
}
export {};
