import CommandModule from '../module/Module';
declare type NullOr<T> = T | null;
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
