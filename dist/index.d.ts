declare module 'djs-commander/module/Module' {
	import { Message } from 'discord.js'; type CommandOptions = {
	    name: string;
	    level: number;
	    group: string;
	    aliases?: string[];
	    owner: boolean;
	    required_args_length?: number;
	    is_guild_only: boolean;
	};
	export default abstract class CommandModule {
	    private moduleOptions;
	    constructor(options: CommandOptions);
	    getOptions(): Readonly<CommandOptions> | null;
	    abstract run(msg: Message, args?: unknown[]): void;
	}
	export {};

}
declare module 'djs-commander/registry/ModuleRegistry' {
	import CommandModule from 'djs-commander/module/Module'; type NullOr<T> = T | null;
	export default class Registry {
	    private commands;
	    add(module: CommandModule): boolean;
	    register(module: CommandModule): boolean;
	    remove(moduleName: string): void;
	    get(moduleName: string): Promise<NullOr<CommandModule>>;
	    getList(): CommandModule[];
	    getFromPotentialAlias(alias: string): Promise<NullOr<CommandModule>>;
	}
	export {};

}
declare module 'djs-commander/module/EventModule' {
	 type EventOptions = {
	    event: string;
	    customName: string;
	};
	export default abstract class EventModule {
	    private options;
	    constructor(options: EventOptions);
	    getOptions(): EventOptions | null;
	    abstract handle(data: unknown): void;
	}
	export {};

}
declare module 'djs-commander/registry/EventRegistry' {
	import EventModule from 'djs-commander/module/EventModule';
	export default class EventRegistry {
	    private events;
	    add(event: EventModule): boolean;
	    register(event: EventModule): boolean;
	    remove(eventName: string): void;
	    getList(): EventModule[];
	}

}
declare module 'djs-commander/utils/Utils' {
	import { Collection, User, Message, GuildMember } from 'discord.js';
	import { CommanderClient } from 'djs-commander/client';
	import ModuleRegistry from 'djs-commander/registry/ModuleRegistry';
	import EventRegistry from 'djs-commander/registry/EventRegistry';
	import EventModule from 'djs-commander/module/EventModule';
	export default class CommanderUtils {
	    static addCachedUsers(client: CommanderClient, cache: Collection<string, User>): void;
	    static canExecute(level: number, userLevel: number, commandRequiresOwner: boolean, isOwner: boolean): boolean;
	    static ShiftNTimes(n: number, array: unknown[]): void;
	    static handle(client: CommanderClient, msg: Message, user: GuildMember | User): Promise<void>;
	    static registerModulesIn(registry: ModuleRegistry, path: string): void;
	    static registerEventModules(registry: EventRegistry, path: string): Promise<EventModule[]>;
	}

}
declare module 'djs-commander/registry/UserRegistry' {
	import { User } from 'discord.js'; type RegistryUser = {
	    user: User;
	    id: string;
	    username: string;
	    tag: string;
	    level: number;
	    owner: boolean;
	};
	export default class UserRegistry {
	    private users;
	    add(user: RegistryUser): boolean;
	    register(user: RegistryUser): boolean;
	    remove(id: string): void;
	    get(id: string): Promise<RegistryUser>;
	}
	export {};

}
declare module 'djs-commander/provider/Provider' {
	import UserRegistry from 'djs-commander/registry/UserRegistry';
	import { CommanderClient } from 'djs-commander/client'; type ExpectedProviderJSON = {
	    id: string;
	    level: number;
	    owner: boolean;
	};
	export default class Provider {
	    static fromJSON(client: CommanderClient, registry: UserRegistry, users: ExpectedProviderJSON[]): void;
	    static fromDB(): void;
	}
	export {};

}
declare module 'djs-commander/provider/ProviderType' {
	export enum ProviderType {
	    JSON = 0,
	    DATABASE = 1
	}

}
declare module 'djs-commander/client' {
	import Discord, { ClientOptions } from 'discord.js';
	import UserRegistry from 'djs-commander/registry/UserRegistry';
	import ModuleRegistry from 'djs-commander/registry/ModuleRegistry';
	import CommandModule from 'djs-commander/module/Module';
	import { ProviderType } from 'djs-commander/provider/ProviderType'; type CommanderOptions = {
	    prefix: string;
	    modulePath: string;
	    eventModulePath?: string;
	    owners: string[];
	    blacklist?: string[];
	    providerConfig?: {
	        path: string;
	        type: ProviderType;
	    };
	};
	export class CommanderClient extends Discord.Client {
	    private _commanderOptions;
	    private userRegistry;
	    private moduleRegistry;
	    private eventRegistry;
	    private provider;
	    constructor(options: ClientOptions, commanderOptions: CommanderOptions);
	    getModules(): ModuleRegistry;
	    getUsers(): UserRegistry;
	    getCommanderOptions(): CommanderOptions;
	    registerModule(module: CommandModule): void;
	    blacklist(id: string): void;
	}
	export {};

}
declare module 'djs-commander/index' {
	export {};

}
declare module 'djs-commander/tests/test' {
	export {};

}
declare module 'djs-commander/tests/events/a' {
	import EventModule from 'djs-commander/module/EventModule';
	import { Message } from 'discord.js';
	export default class MessageCreate extends EventModule {
	    constructor();
	    handle(data: Message): void;
	}

}
declare module 'djs-commander/tests/modules/a' {
	import Module from 'djs-commander/module/Module';
	import { Message } from 'discord.js';
	export default class A extends Module {
	    constructor();
	    run(msg: Message): void;
	}

}
declare module 'djs-commander/tests/modules/b' {
	import Module from 'djs-commander/module/Module';
	import { Message } from 'discord.js';
	export default class A extends Module {
	    constructor();
	    run(msg: Message): void;
	}

}
