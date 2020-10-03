import { Collection, User, Message, GuildMember } from 'discord.js';
import { CommanderClient } from '../client';
import ModuleRegistry from '../registry/ModuleRegistry';
import EventRegistry from '../registry/EventRegistry';
import EventModule from '../module/EventModule';
export default class CommanderUtils {
    static addCachedUsers(client: CommanderClient, cache: Collection<string, User>): void;
    static canExecute(level: number, userLevel: number, commandRequiresOwner: boolean, isOwner: boolean): boolean;
    static ShiftNTimes(n: number, array: unknown[]): void;
    static handle(client: CommanderClient, msg: Message, user: GuildMember | User): Promise<void>;
    static registerModulesIn(registry: ModuleRegistry, path: string): void;
    static registerEventModules(registry: EventRegistry, path: string): Promise<EventModule[]>;
}
