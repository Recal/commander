import CommandModule from '../module/Module';
declare type NullOr<T> = T | null;
export default class Registry {
    private _commands;
    add(module: CommandModule): boolean;
    register(module: CommandModule): boolean;
    remove(moduleName: string): void;
    get(moduleName: string): Promise<CommandModule | null>;
    getList(): CommandModule[];
    getFromPotentialAlias(alias: string): Promise<NullOr<CommandModule>>;
}
export {};
