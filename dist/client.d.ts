import Discord, { ClientOptions } from 'discord.js';
import UserRegistry from './registry/UserRegistry';
import ModuleRegistry from './registry/ModuleRegistry';
import CommandModule from './module/Module';
import { ProviderType } from './provider/ProviderType';
declare type CommanderOptions = {
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
export declare class CommanderClient extends Discord.Client {
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
